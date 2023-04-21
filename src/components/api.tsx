import axios, { AxiosError } from 'axios'
import * as cookie from 'cookie'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'X-Admin-Password':  cookie.parse(document.cookie).adminPassword
  }
});

export function extractMessage(e: Error | AxiosError<any>): string {
  if (e instanceof AxiosError) {
    return e.response?.data?.message || e.response?.data?.error?.message || e.message
  } else {
    return e.message
  }
}

export default api
