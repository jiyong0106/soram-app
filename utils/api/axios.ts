import axios from "axios";

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL + "/api/v1",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default instance;

// GET → get

// POST → create

// PUT/PATCH → update

// DELETE → delete
