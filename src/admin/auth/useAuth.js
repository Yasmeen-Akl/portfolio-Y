import { createContext, useContext } from 'react';

// { status, user, signIn, signOut }
// status: loading | signedOut | notAdmin | admin | preview
// "preview" = Supabase isn't configured yet; the dashboard opens read-only on seed data.
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
