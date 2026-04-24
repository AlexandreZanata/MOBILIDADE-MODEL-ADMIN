import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
}

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: AxiosError) => void;
}

export const useApi = <T = any>(options?: UseApiOptions) => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (apiCall: () => Promise<any>) => {
            try {
                setState({ data: null, loading: true, error: null });
                const response = await apiCall();
                setState({ data: response.data, loading: false, error: null });
                options?.onSuccess?.(response.data);
                return response;
            } catch (err: any) {
                setState({ data: null, loading: false, error: err });
                options?.onError?.(err);
                throw err;
            }
        },
        [options]
    );

    return { ...state, execute };
};