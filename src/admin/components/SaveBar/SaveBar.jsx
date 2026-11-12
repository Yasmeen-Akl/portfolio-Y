import './SaveBar.css';

// Sticky page header: title, dirty indicator, save feedback and the single Save button.
export default function SaveBar({ title, dirty, status, message, onSave }) {
  let text = '';
  let tone = '';
  if (status === 'saving') text = 'Saving…';
  else if (status === 'error') [text, tone] = [`Couldn’t save: ${message}`, 'is-error'];
  else if (dirty) [text, tone] = ['Unsaved changes', 'is-dirty'];
  else if (status === 'saved') [text, tone] = ['Saved ✓', 'is-saved'];

  return (
    <div className="save-bar">
      <h1 className="save-bar-title">{title}</h1>
      <p className={`save-bar-status ${tone}`} role="status" aria-live="polite">
        {text}
      </p>
      {onSave && (
        <button type="button" className="btn btn-primary" onClick={onSave} disabled={!dirty || status === 'saving'}>
          Save changes
        </button>
      )}
    </div>
  );
}
