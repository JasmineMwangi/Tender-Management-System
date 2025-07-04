// frontend/src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

export const useApiMutation = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  return { mutate, loading, error };
};