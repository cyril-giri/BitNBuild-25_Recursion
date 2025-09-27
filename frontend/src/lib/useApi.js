import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


/**
 * useApi - Custom hook for fetching data from any API (axios or custom fetch).
 * @param {Object} options
 * - fetchFn: async function (custom fetch logic, e.g. Supabase)
 * - manual: boolean (If true, prevents fetch on mount/deps change; requires explicit refetch call) <-- NEW
 * // ... other params ...
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
    manual = false, // <-- NEW: Default is false (auto-run)
  } = options || {};

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  
  // State to hold the most recent result when called manually, useful for submission handlers
  const [lastResult, setLastResult] = useState({ data: null, error: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus(null);
    
    let result = { data: null, error: null };
    
    try {
      let response;
      if (fetchFn) {
        // Handle Supabase/custom fetchFn
        response = await fetchFn();
        // Supabase returns { data, error } directly on the result object
        result.data = response?.data || response;
        result.error = response?.error || null;
      } else if (url) {
        // Handle Axios request
        const res = await axios({ url, method, params, data: body, headers });
        response = res.data;
        setStatus(res.status);
        result.data = res.data;
      } else {
        throw new Error('No fetchFn or url provided');
      }

      setData(result.data);
      setError(result.error);
      
      // Update local result state
      setLastResult({ data: result.data, error: result.error });

      // Note: If you want to use the return value of refetch, return the final data/error object.
      return { data: result.data, error: result.error }; 
      
    } catch (err) {
      const finalError = err?.response?.data?.message || err.message || err;
      
      setError(finalError);
      setData(null);
      setStatus(err?.response?.status || null);
      
      // Update local result state
      setLastResult({ data: null, error: finalError });

      // If manual is true, we throw/return the error so the caller can handle it immediately
      return { data: null, error: finalError };

    } finally {
      setLoading(false);
    }
  }, [url, method, fetchFn, params, body, headers, ...deps]); // Note: Spread 'deps' *outside* of dependency array to prevent infinite loop

  useEffect(() => {
    // Only fetch on mount/deps change if manual is FALSE
    if (!manual) {
      fetchData();
    }
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
    // Provide the last result as well, which is helpful for sequential logic checks
    lastResult, 
  };
}