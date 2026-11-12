import { useState } from 'react';
import { uploadImage, validateImage } from '../../../data/api.js';
import { cx } from '../../../lib/cx.js';
import './ImageField.css';

// Upload / preview / replace / remove for one image URL.
// Files go to the storage bucket as `{section}/{uuid}.{ext}`; the resulting public URL is the value.
export default function ImageField({ label, value, onChange, section, tall }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow picking the same file again
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setError('');
    const result = await uploadImage(section, file);
    setBusy(false);
    if (result.error) setError(`Upload failed: ${result.error}`);
    else onChange(result.data);
  };

  return (
    <div className="image-field">
      <span className="field-label">{label}</span>
      <div className="image-field-body">
        <div className={cx('image-preview', tall && 'is-tall')}>
          {value ? <img src={value} alt={`${label} preview`} /> : <span>No image</span>}
        </div>
        <div className="image-actions">
          <label className={cx('btn image-pick', busy && 'is-busy')}>
            {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
            <input
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label={`${value ? 'Replace' : 'Upload'} ${label}`}
              disabled={busy}
              onChange={pick}
            />
          </label>
          {value && (
            <button type="button" className="btn" onClick={() => onChange('')} aria-label={`Remove ${label}`}>
              Remove
            </button>
          )}
          <span className="field-hint">JPG, PNG or WebP · up to 3 MB</span>
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
