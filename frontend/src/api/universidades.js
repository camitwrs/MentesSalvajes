import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getUniversidadesPorPaisRequest = (nombrepais) =>
  axios.get(`${API}/universidades/pais/${nombrepais}`);
