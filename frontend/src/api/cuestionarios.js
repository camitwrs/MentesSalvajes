import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getCuestionariosRequest = () => axios.get(`${API}/cuestionarios`);

export const crearCuestionarioRequest = (cuestionario) =>
  axios.post(`${API}/cuestionarios`, cuestionario);

export const getCuestionariosPorTituloRequest = (titulocuestionario) =>
  axios.get(`${API}/cuestionarios/titulo/${titulocuestionario}`);

export const getTotalCuestionariosRequest = () =>
  axios.get(`${API}/cuestionarios/total`);

export const getCuestionarioPorIdRequest = (idcuestionario) =>
  axios.get(`${API}/cuestionarios/id/${idcuestionario}`);

export const getDiferenciaCuestionariosRequest = () =>
  axios.get(`${API}/cuestionarios/diferencia`);

export const actualizarCuestionarioRequest = (idcuestionario, data) =>
  axios.put(`${API}/cuestionarios/update/${idcuestionario}`, data);

export const eliminarCuestionarioRequest = (idcuestionario) =>
  axios.delete(`${API}/cuestionarios/delete/${idcuestionario}`);
