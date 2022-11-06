import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: unknown;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(url: string): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    data: undefined,
    loading: false,
    error: undefined,
  });
  async function mutation(data: any) {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await (
        await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setState((prev) => ({ ...prev, data: result as any }));
    } catch (error) {
      setState((prev) => ({ ...prev, error }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }
  return [mutation, state];
}
