import axios from "axios";

const API = "http://localhost:3000/api";

export const getRespuestasPorUsuarioRequest = (idusuario) =>
  axios.get(`${API}/respuestas/usuario/${idusuario}`);

export const guardarRespuestaRequest = (respuesta) =>
  axios.post(`${API}/respuestas/enviar`, respuesta);

export const getAllRespuestasTextoRequest = (idusuario, idcuestionario) =>
  axios.get(`${API}/respuestas/texto`, {
    params: { idusuario, idcuestionario },
  });
