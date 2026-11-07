import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

// Responses are cached for the session so moving between pages feels instant.
const cache = new Map();

export function useApi(path) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(() =>
    cache.has(path) ? { data: cache.get(path), loading: false, error: null } : { data: null, loading: true, error: null }
  );

  useEffect(() => {
    if (!path) return undefined;
    if (cache.has(path)) {
      setState({ data: cache.get(path), loading: false, error: null });
      return undefined;
    }
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    api
      .get(path, { signal: controller.signal })
      .then((body) => {
        cache.set(path, body.data);
        setState({ data: body.data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [path, attempt]);

  const retry = useCallback(() => {
    cache.delete(path);
    setAttempt((n) => n + 1);
  }, [path]);

  return { ...state, retry };
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Poly Learning Foundation` : 'Poly Learning Foundation — We invent jobs';
  }, [title]);
}

export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
