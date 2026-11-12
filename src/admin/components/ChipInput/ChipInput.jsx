import { useId, useRef, useState } from 'react';
import { cx } from '../../../lib/cx.js';
import './ChipInput.css';

const short = (text) => (text.length > 40 ? text.slice(0, 40) + '…' : text);

// Edits a text[] as chips. Type + Enter adds, click a chip to edit it, × removes it.
// `multiline` is for long entries (paragraphs): chips become full-width blocks that can be
// moved up/down, and Ctrl/⌘ + Enter adds.
export default function ChipInput({ label, values, onChange, multiline, placeholder, hint }) {
  const list = values || [];
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(null);
  const input = useRef(null);
  const id = useId();
  const Entry = multiline ? 'textarea' : 'input';

  const commit = () => {
    const value = text.trim();
    if (value) onChange(editing === null ? [...list, value] : list.map((v, i) => (i === editing ? value : v)));
    setEditing(null);
    setText('');
  };
  const edit = (i) => {
    setEditing(i);
    setText(list[i]);
    input.current.focus();
  };
  const remove = (i) => {
    onChange(list.filter((_, k) => k !== i));
    setEditing(null);
    setText('');
  };
  const move = (i, step) => {
    const j = i + step;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setEditing(null);
    setText('');
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape' && editing !== null) {
      setEditing(null);
      setText('');
    } else if (e.key === 'Backspace' && !multiline && !text && editing === null && list.length) {
      remove(list.length - 1);
    }
  };

  return (
    <div className={cx('chip-input', multiline && 'is-multiline')}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {list.length > 0 && (
        <ul className="chips">
          {list.map((value, i) => (
            <li className={cx('chip', editing === i && 'is-editing')} key={i}>
              <button type="button" className="chip-text" onClick={() => edit(i)} aria-label={`Edit “${short(value)}”`}>
                {value}
              </button>
              {multiline && (
                <>
                  <button
                    type="button"
                    className="chip-btn"
                    aria-label={`Move “${short(value)}” up`}
                    aria-disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="chip-btn"
                    aria-label={`Move “${short(value)}” down`}
                    aria-disabled={i === list.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                </>
              )}
              <button type="button" className="chip-btn" aria-label={`Remove “${short(value)}”`} onClick={() => remove(i)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="chip-entry">
        <Entry
          id={id}
          ref={input}
          className="field-input"
          rows={multiline ? 3 : undefined}
          value={text}
          placeholder={placeholder || (multiline ? 'Write, then press Ctrl + Enter' : 'Type and press Enter')}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="btn" onClick={commit} disabled={!text.trim()}>
          {editing === null ? 'Add' : 'Update'}
        </button>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
