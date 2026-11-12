import SaveBar from '../SaveBar/SaveBar.jsx';

// Frame shared by every editor page: save bar, intro, loading / load-error states.
// `children` is a render function: (draft, change) => fields.
export default function Page({ title, intro, editor, children }) {
  const { draft, change, dirty, status, message, save } = editor;
  const loadFailed = draft === null && status === 'error';

  return (
    <div className="admin-page">
      <SaveBar title={title} dirty={dirty} status={loadFailed ? 'ready' : status} message={message} onSave={save} />
      {intro && <p className="page-intro">{intro}</p>}
      {status === 'loading' && <p>Loading…</p>}
      {loadFailed && (
        <p className="field-error" role="alert">
          Couldn’t load this page: {message}
        </p>
      )}
      {draft && children(draft, change)}
    </div>
  );
}

export function Panel({ title, note, children }) {
  return (
    <div className="panel">
      {title && <h2 className="panel-title">{title}</h2>}
      {note && <p className="panel-note">{note}</p>}
      {children}
    </div>
  );
}
