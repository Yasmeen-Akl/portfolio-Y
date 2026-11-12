import './ListEditor.css';

// Editable, reorderable list. Order in the array is the saved sort_order.
//   renderItem(item, patch, index) → fields for one row; patch({ field: value }) updates it
//   createItem()                   → a new blank row (with its own id)
export default function ListEditor({
  items,
  onChange,
  renderItem,
  createItem,
  itemLabel = (item, i) => `Item ${i + 1}`,
  itemBadge,
  addLabel = 'Add item',
  empty = 'Nothing here yet.',
}) {
  const move = (i, step) => {
    const j = i + step;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i, name) => {
    if (window.confirm(`Delete “${name}”? This takes effect when you save.`)) {
      onChange(items.filter((_, k) => k !== i));
    }
  };
  const patch = (i, changes) => onChange(items.map((item, k) => (k === i ? { ...item, ...changes } : item)));

  return (
    <div className="list-editor">
      {items.length === 0 && <p className="list-empty">{empty}</p>}
      <ol className="list-rows">
        {items.map((item, i) => {
          const name = itemLabel(item, i) || `Item ${i + 1}`;
          return (
            <li className="list-row" key={item.id}>
              <div className="list-row-head">
                <span className="list-row-index">{i + 1}</span>
                <span className="list-row-title">{name}</span>
                {itemBadge?.(item)}
                {/* aria-disabled (not disabled) so keyboard focus survives reaching either end */}
                <button
                  type="button"
                  className="row-btn"
                  aria-label={`Move “${name}” up`}
                  aria-disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="row-btn"
                  aria-label={`Move “${name}” down`}
                  aria-disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </button>
                <button type="button" className="row-btn is-danger" onClick={() => remove(i, name)}>
                  Delete<span className="visually-hidden"> “{name}”</span>
                </button>
              </div>
              <div className="list-row-body">{renderItem(item, (changes) => patch(i, changes), i)}</div>
            </li>
          );
        })}
      </ol>
      <button type="button" className="btn list-add" onClick={() => onChange([...items, createItem()])}>
        + {addLabel}
      </button>
    </div>
  );
}
