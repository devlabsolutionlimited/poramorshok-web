import { useState } from 'react';
import { ApiError, NetworkError, AuthenticationError } from '../errors';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = async (...args: any[]) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await apiCall(...args);
      setState({ data, error: null, isLoading: false });
      options.onSuccess?.(data);
      return data;
    } catch (error) {
      let processedError: Error;

      if (error instanceof ApiError || 
          error instanceof NetworkError || 
          error instanceof AuthenticationError) {
        processedError = error;
      } else {
        processedError = new Error('An unexpected error occurred');
      }

      setState({ data: null, error: processedError, isLoading: false });
      options.onError?.(processedError);
      throw processedError;
    }
  };

  return {
    ...state,
    execute,
  };
}