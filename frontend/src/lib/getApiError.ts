import axios from 'axios';

export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // Server responded with an error body
    if (err.response?.data?.error?.message) {
      return String(err.response.data.error.message);
    }
    // Server responded but no structured error body
    if (err.response) {
      return `Server error (${err.response.status}). Please try again.`;
    }
    // No response — backend unreachable or request blocked
    return 'Cannot reach the server. Make sure the backend is running.';
  }
  return 'Something went wrong. Please try again.';
}
