import axios, { Axios } from "axios";

const globalForAxios = globalThis as unknown as { axios: Axios };

export const axiosClient =
  globalForAxios.axios ||
  axios.create({ baseURL: import.meta.env.VITE_BASE_AXIOS_URL });

if (process.env.NODE_ENV !== "production") globalForAxios.axios = axiosClient;
