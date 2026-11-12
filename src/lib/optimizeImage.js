// Shrinks and re-encodes an image in the browser before it is uploaded.
//   - longest side capped at `maxSide` (never upscaled)
//   - EXIF orientation applied
//   - WebP at quality .82 (keeps transparency); JPEG .85 where WebP encoding isn't available
//   - if the result is still over 4 MB, tries again at lower quality
const TARGET_BYTES = 4 * 1024 * 1024;
const WEBP_QUALITIES = [0.82, 0.72, 0.62];
const JPEG_QUALITIES = [0.85, 0.72, 0.62];

const isHeic = (file) => /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name || '');

const encode = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

// Resolves to a Blob (image/webp or image/jpeg). Rejects with a message meant for the user.
export async function optimizeImage(file, maxSide) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(
      isHeic(file)
        ? 'This browser can’t open HEIC photos. Export the photo as JPG or PNG and try again.'
        : 'This image couldn’t be read. Try saving it again as JPG or PNG.',
    );
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  // Browsers that can't encode WebP hand back a PNG instead; detect that and switch to JPEG.
  let blob = await encode(canvas, 'image/webp', WEBP_QUALITIES[0]);
  let type = 'image/webp';
  let qualities = WEBP_QUALITIES;
  if (!blob || blob.type !== 'image/webp') {
    type = 'image/jpeg';
    qualities = JPEG_QUALITIES;
    // JPEG has no transparency: put the picture on white rather than black.
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    blob = await encode(canvas, type, qualities[0]);
  }

  for (const quality of qualities.slice(1)) {
    if (blob && blob.size <= TARGET_BYTES) break;
    blob = await encode(canvas, type, quality);
  }
  if (!blob) throw new Error('This image couldn’t be optimized. Try a different file.');
  return blob;
}

export const formatBytes = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
