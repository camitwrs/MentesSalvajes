import axios from "axios";

const API = "http://localhost:3000/api";

export const getRespuestasPorUsuarioRequest = (idusuario) =>
  axios.get(`${API}/respuestas/usuario/${idusuario}`);

export const getRespuestasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/respuestas/cuestionario/${idcuestionario}`);

export const registrarRespuestaRequest = (respuesta) =>
  axios.post(`${API}/respuestas`, respuesta);
