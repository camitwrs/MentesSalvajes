import axios from "axios";

const API = "http://localhost:3000/api";

export const getPreguntasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/preguntas/cuestionario/${idcuestionario}`);

export const crearPreguntaRequest = (pregunta) =>
  axios.post(`${API}/preguntas`, pregunta);

export const getPreguntasPorTipo = (tipopregunta) =>
  axios.get(`${API}/preguntas/tipo/${tipopregunta}`);
