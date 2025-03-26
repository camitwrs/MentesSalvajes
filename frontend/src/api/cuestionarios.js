import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getCuestionariosRequest = () => axios.get(`${API}/cuestionarios`);

export const crearCuestionariosRequest = (cuestionario) =>
  axios.post(`${API}/cuestionarios`, cuestionario);

export const getCuestionariosPorTituloRequest = (titulocuestionario) =>
  axios.get(`${API}/cuestionarios/titulo/${titulocuestionario}`);

export const getAllCuestionariosRequest = () =>
  axios.get(`${API}/cuestionarios/all`);

export const getDiferenciaCuestionariosRequest = () =>
  axios.get(`${API}/cuestionarios/diferencia`);
