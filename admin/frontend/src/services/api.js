import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API, // from .env
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
