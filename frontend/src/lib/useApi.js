import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useApi(options) {
  const {
    url,
    method = 'get',
    fetchFn,
    params,
    data: body,
    headers,
    deps = [],
    manual = false,
  } = options || {};

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!manual);
  const [lastResult, setLastResult] = useState({ data: null, error: null });

  // --- FIX: Re-added '...args' to accept and pass arguments ---
  const fetchData = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    let result = { data: null, error: null };
    
    try {
      let response;
      if (fetchFn) {
        // Pass any arguments from 'refetch' to your custom fetch function
        response = await fetchFn(...args);
        
        // This handles both Supabase { data, error } objects and direct data returns
        result.data = response?.data === undefined ? response : response.data;
        result.error = response?.error || null;

      } else if (url) {
        const res = await axios({ url, method, params, data: body, headers });
        result.data = res.data;
      } else {
        throw new Error('No fetchFn or url provided');
      }
      
      if (result.error) throw result.error;

      setData(result.data);
      setLastResult({ data: result.data, error: null });
      return { data: result.data, error: null }; 
      
    } catch (err) {
      const finalError = err?.response?.data?.message || err.message || err;
      setError(finalError);
      setData(null);
      setLastResult({ data: null, error: finalError });
      return { data: null, error: finalError };
    } finally {
      setLoading(false);
    }
  }, deps); // The hook should only depend on 'deps' to avoid unnecessary re-renders

  useEffect(() => {
    if (!manual) {
      fetchData();
    }
  }, [fetchData, manual]);

  return {
    data,
    error,
    loading,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && !!error,
    refetch: fetchData,
    lastResult, 
  };
}