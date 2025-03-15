import axios from "axios";

const API = "http://localhost:3000/api";

export const guardarMensajeRequest = (mensaje) =>
  axios.post(`${API}/ilustraciones/guardar-mensaje`, mensaje);

export const getAllIlustracionesRequest = () =>
  axios.get(`${API}/ilustraciones`);

export const guardarArchivoRequest = (archivo) =>
  axios.post(`${API}/ilustraciones/guardar-archivo`, archivo);
