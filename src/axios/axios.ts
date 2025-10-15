import axios, { type AxiosInstance } from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const axiosAuth: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   // "Content-Type": "application/json",
  // },
});
