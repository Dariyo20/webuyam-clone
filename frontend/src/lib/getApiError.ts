import axios from 'axios';

export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
    return String(err.response.data.error.message);
  }
  return 'Something went wrong. Please try again.';
}
