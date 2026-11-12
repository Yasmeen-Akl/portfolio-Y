import { useState } from 'react';
import { uploadImage, validateImage } from '../../../data/api.js';
import { formatBytes, optimizeImage } from '../../../lib/optimizeImage.js';
import { cx } from '../../../lib/cx.js';
import './ImageField.css';

// Upload / preview / replace / remove for one image URL.
// Any size is accepted: the image is resized (longest side ≤ maxSide) and re-encoded in the
// browser, then stored in the bucket as `{section}/{uuid}.{ext}`. The public URL is the value.
export default function ImageField({ label, value, onChange, section, tall, maxSide = 2400 }) {
  const [phase, setPhase] = useState('idle'); // idle | optimizing | uploading
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const busy = phase !== 'idle';

  const pick = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow picking the same file again
    if (!file) return;
    setDone('');
    const invalid = validateImage(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError('');
    try {
      setPhase('optimizing');
      const optimized = await optimizeImage(file, maxSide);
      setPhase('uploading');
      const result = await uploadImage(section, optimized);
      if (result.error) {
        setError(`Upload failed: ${result.error}`);
      } else {
        onChange(result.data);
        setDone(`Uploaded · ${formatBytes(optimized.size)}`);
      }
    } catch (problem) {
      setError(problem.message);
    }
    setPhase('idle');
  };

  const action = value ? 'Replace' : 'Upload';

  return (
    <div className="image-field">
      <span className="field-label">{label}</span>
      <div className="image-field-body">
        <div className={cx('image-preview', tall && 'is-tall')}>
          {value ? <img src={value} alt={`${label} preview`} /> : <span>No image</span>}
        </div>
        <div className="image-actions">
          <label className={cx('btn image-pick', busy && 'is-busy')}>
            {phase === 'optimizing' ? 'Optimizing…' : phase === 'uploading' ? 'Uploading…' : action}
            <input
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              aria-label={`${action} ${label}`}
              disabled={busy}
              onChange={pick}
            />
          </label>
          {value && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                onChange('');
                setDone('');
              }}
              aria-label={`Remove ${label}`}
            >
              Remove
            </button>
          )}
          <span className="field-hint">JPG, PNG or WebP · any size — optimized automatically</span>
          <span className="image-status" role="status" aria-live="polite">
            {done}
          </span>
          {error && (
            <span className="field-error" role="alert">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
