import './Field.css';

// Every control is wrapped in its <label>, so each input has an accessible name.

export function TextField({ label, value, onChange, multiline, rows = 3, hint, ...rest }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <Tag
        className="field-input"
        value={value ?? ''}
        rows={multiline ? rows : undefined}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

// Empty input ↔ null, so "no number" stays distinguishable from 0.
export function NumberField({ label, value, onChange, hint, ...rest }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        {...rest}
      />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function SelectField({ label, value, onChange, options, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="field-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map(([optionValue, text]) => (
          <option value={optionValue} key={optionValue}>
            {text}
          </option>
        ))}
      </select>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

// Lays fields out side by side, wrapping when there isn't room.
export function FieldRow({ children }) {
  return <div className="field-row">{children}</div>;
}
