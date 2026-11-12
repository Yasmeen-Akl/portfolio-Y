import { useEffect, useState } from 'react';
import { fetchAllContent, isConnected } from './api.js';
import { seed } from './seed.js';
import { ContentContext } from './useContent.js';

// Loads all public content once. Seed data is the initial state, so the page paints
// immediately; live data replaces it in place when it arrives.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(seed);

  useEffect(() => {
    if (!isConnected) return undefined;
    let active = true;
    fetchAllContent().then(({ data }) => {
      if (active && data) setContent(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
