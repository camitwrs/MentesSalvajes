import axios from "axios";

// Usamos la variable de entorno
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default instance;
