import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { isConnected, messagesApi } from '../../../data/api.js';
import { cx } from '../../../lib/cx.js';
import SaveBar from '../../components/SaveBar/SaveBar.jsx';
import './MessagesPage.css';

const when = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const replyLink = (m) =>
  `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.topic || 'Your message'}`)}` +
  `&body=${encodeURIComponent(`\n\n— On ${when(m.created_at)}, ${m.name} wrote:\n${m.body}`)}`;

// Inbox for the public contact form. Actions apply immediately (no Save button here).
export default function MessagesPage() {
  const { refreshUnread } = useOutletContext();
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');

  const show = useCallback((result) => {
    if (result.error) setError(result.error);
    else setMessages(result.data);
  }, []);
  const load = () => messagesApi.fetch().then(show);

  useEffect(() => {
    let active = true;
    messagesApi.fetch().then((result) => {
      if (active) show(result);
    });
    return () => {
      active = false;
    };
  }, [show]);

  const act = async (request) => {
    setError('');
    const result = await request;
    if (result.error) setError(result.error);
    await load();
    refreshUnread();
  };
  const toggleRead = (m) => act(messagesApi.update(m.id, { is_read: !m.is_read }));
  const remove = (m) => {
    if (window.confirm(`Delete the message from ${m.name}? This can’t be undone.`)) act(messagesApi.delete(m.id));
  };

  const unread = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <div className="admin-page">
      <SaveBar title="Messages" status="ready" />
      <p className="page-intro">
        {messages === null && !error
          ? 'Loading…'
          : `${messages?.length || 0} message${messages?.length === 1 ? '' : 's'}, ${unread} unread. Newest first.`}
      </p>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {messages?.length === 0 && (
        <p className="admin-notice">
          {isConnected
            ? 'No messages yet. Anything sent through the contact form shows up here.'
            : 'Messages from the contact form will appear here once Supabase is connected.'}
        </p>
      )}
      <ul className="messages">
        {messages?.map((m) => (
          <li className={cx('message', !m.is_read && 'is-unread')} key={m.id}>
            <div className="message-head">
              <span className="message-from">
                {!m.is_read && <span className="message-dot" aria-label="Unread" />}
                {m.name}
              </span>
              <a className="message-email" href={`mailto:${m.email}`}>
                {m.email}
              </a>
              <time className="message-time" dateTime={m.created_at}>
                {when(m.created_at)}
              </time>
            </div>
            {m.topic && <span className="row-badge">{m.topic}</span>}
            <p className="message-body">{m.body}</p>
            <div className="message-actions">
              <a className="btn btn-primary" href={replyLink(m)}>
                Reply by email
              </a>
              <button type="button" className="btn" onClick={() => toggleRead(m)}>
                Mark as {m.is_read ? 'unread' : 'read'}
              </button>
              <button type="button" className="btn message-delete" onClick={() => remove(m)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
