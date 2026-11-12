import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { deleteImages, mediaUrlsIn } from '../../data/api.js';

// Draft state for one dashboard page.
//   load()                 → { data, error }   the page's data object
//   persist(saved, draft)  → { data, error }   writes the draft, resolves to the fresh data
// Tracks dirty state, exposes one save(), and warns before leaving with unsaved changes.
export function useEditor(load, persist) {
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | saving | saved | error
  const [message, setMessage] = useState('');
  const fns = useRef({ load, persist });
  useEffect(() => {
    fns.current = { load, persist };
  });

  useEffect(() => {
    let active = true;
    fns.current.load().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setStatus('error');
        setMessage(error);
        return;
      }
      setSaved(data);
      setDraft(data);
      setStatus('ready');
    });
    return () => {
      active = false;
    };
  }, []);

  const dirty = saved !== null && JSON.stringify(saved) !== JSON.stringify(draft);

  const change = useCallback((updater) => {
    setDraft((d) => (typeof updater === 'function' ? updater(d) : updater));
    setStatus((s) => (s === 'saved' || s === 'error' ? 'ready' : s));
  }, []);

  const save = async () => {
    if (!dirty || status === 'saving') return;
    setStatus('saving');
    setMessage('');
    const { data, error } = await fns.current.persist(saved, draft);
    if (error) {
      setStatus('error');
      setMessage(error);
      return;
    }
    // Images that were replaced or removed are only deleted from storage once the save succeeded.
    const still = mediaUrlsIn(data);
    const stale = [...mediaUrlsIn(saved)].filter((url) => !still.has(url));
    if (stale.length) deleteImages(stale);
    setSaved(data);
    setDraft(data);
    setStatus('saved');
  };

  // Leaving with unsaved changes: in-app navigation…
  const blocker = useBlocker(dirty);
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (window.confirm('You have unsaved changes. Leave without saving?')) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  // …and closing / reloading the tab.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  return { draft, change, dirty, status, message, save };
}

// Small helpers for writing load/persist functions.
export const mapResult = (result, fn) => (result.error ? result : { data: fn(result.data), error: null });
export const newId = () => crypto.randomUUID();
