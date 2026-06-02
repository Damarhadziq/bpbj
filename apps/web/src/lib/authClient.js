import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:4000/api/v1`;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      data: null,
      error: {
        message: data?.error || 'Permintaan gagal diproses.',
      },
    };
  }

  return { data, error: null };
};

export const signIn = {
  email: async ({ email, password, rememberMe = false }) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  }),
};

export const signUp = {};

export const signOut = async () => request('/auth/logout', { method: 'POST' });

export const getSession = async () => request('/auth/session');

export const useSession = () => {
  const [state, setState] = useState({ data: undefined, isPending: true });

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data } = await getSession();
        if (isMounted) setState({ data, isPending: false });
      } catch {
        if (isMounted) setState({ data: null, isPending: false });
      }
    };

    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  return state;
};
