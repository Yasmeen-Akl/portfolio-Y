import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { AuthContext } from './useAuth.js';

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: supabase ? 'loading' : 'preview', user: null });

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    const resolve = async (session) => {
      if (!session) {
        if (active) setState({ status: 'signedOut', user: null });
        return;
      }
      // Admin rights are decided by the database, never by the client.
      const { data, error } = await supabase.rpc('is_admin');
      if (active) setState({ status: !error && data === true ? 'admin' : 'notAdmin', user: session.user });
    };

    supabase.auth
      .getSession()
      .then(({ data }) => resolve(data.session))
      .catch(() => active && setState({ status: 'signedOut', user: null }));

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;
      setTimeout(() => resolve(session), 0); // never call Supabase inside this callback
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) return 'Supabase not connected';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };
  const signOut = () => supabase?.auth.signOut();

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>;
}
