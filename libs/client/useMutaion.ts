import { useState } from "react";

export interface UseMutationState {
  data: undefined | any;
  loading: boolean;
  error: undefined | any;
}
type UseMutationResult = [(data: any) => void, UseMutationState];
export default function useMutation(url: string): UseMutationResult {
  const [state, setState] = useState<UseMutationState>({
    data: undefined,
    loading: false,
    error: undefined,
  });
  async function mutation(data: any) {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setState((prev) => ({ ...prev, loading: false, data: result }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
    }
  }
  return [mutation, state];
}
