import axios from "axios";

const api = axios.create({
  baseURL: '/api',  // Now same-origin as your frontend
  withCredentials: true,
});

export default api;
