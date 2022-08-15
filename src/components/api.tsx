import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {'Accept': 'application/json'}
});

export function extractMessage(e: Error | AxiosError<any>): string {
  if (e instanceof AxiosError) {
    return e.response?.data?.message || e.response?.data?.error?.message || e.message
  } else {
    return e.message
  }
}

export default api
