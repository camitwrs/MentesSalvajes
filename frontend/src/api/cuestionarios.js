import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getCuestionariosRequest = () => axios.get(`${API}/cuestionarios`);

export const crearCuestionarioRequest = (cuestionario) =>
  axios.post(`${API}/cuestionarios`, cuestionario);

export const getCuestionariosPorTituloRequest = (titulocuestionario) =>
  axios.get(`${API}/cuestionarios/titulo/${titulocuestionario}`);

export const getAllCuestionariosRequest = () =>
  axios.get(`${API}/cuestionarios/all`);

export const getDiferenciaCuestionariosRequest = () =>
  axios.get(`${API}/cuestionarios/diferencia`);

export const actualizarCuestionarioRequest = (idcuestionario, data) =>
  axios.put(`${API}/cuestionarios/update/${idcuestionario}`, data);

export const eliminarCuestionarioRequest = (idcuestionario) =>
  axios.delete(`${API}/cuestionarios/delete/${idcuestionario}`);
