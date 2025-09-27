import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


/**
 * useApi - Custom hook for fetching data from any API (axios or custom fetch).
 * @param {Object} options
 *   - url: string (for axios requests)
 *   - method: string (for axios requests, default 'get')
 *   - fetchFn: async function (custom fetch logic, e.g. Supabase)
 *   - params, data, headers: axios config options
 *   - deps: dependency array for refetching
 * @returns {Object} { data, error, loading, status, isSuccess, isError, refetch }
 */
export function useApi(options) {
  const {
    url,
    method = 'get',
    fetchFn,
    params,
    data: body,
    headers,
    deps = [],
  } = options || {};

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      let response;
      if (fetchFn) {
        response = await fetchFn();
      } else if (url) {
        const res = await axios({ url, method, params, data: body, headers });
        response = res.data;
        setStatus(res.status);
      } else {
        throw new Error('No fetchFn or url provided');
      }
      setData(response);
      setError(null);
      if (!status && response?.status) setStatus(response.status);
    } catch (err) {
      setError(err);
      setData(null);
      setStatus(err?.response?.status || null);
    } finally {
      setLoading(false);
    }
  }, [url, method, fetchFn, params, body, headers, ...deps]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    error,
    loading,
    status,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && !!error,
    refetch: fetchData,
  };
}
