import { createContext, useContext } from 'react';
import { seed } from './seed.js';

// All public content. Defaults to the local seed.
export const ContentContext = createContext(seed);

export const useContent = () => useContext(ContentContext);
