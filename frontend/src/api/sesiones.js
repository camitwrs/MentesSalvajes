import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getSesionesPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/sesiones/cuestionario/${idcuestionario}`);

export const eliminarSesionRequest = (idsesion) =>
  axios.delete(`${API}/sesiones/${idsesion}`);

export const crearSesionRequest = (sesion) =>
  axios.post(`${API}/sesiones`, sesion);

export const validarCodigoSesionRequest = (codigosesion) =>
  axios.get(`${API}/sesiones/validar/${codigosesion}`);