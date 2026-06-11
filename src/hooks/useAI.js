import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = useCallback(async (fn, params, successMsg) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const toastId = toast.loading('Generating with AI...');
    try {
      const data = await fn(params);
      setResult(data);
      toast.success(successMsg || 'Generated successfully!', { id: toastId });
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'AI generation failed', { id: toastId });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { loading, result, error, generate, reset };
};
