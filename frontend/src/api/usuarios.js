import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/*
Función: getDatosEducadorRequest.
--------------------------------------------
Consulta la base de datos usando el idusuario (proporcionado en req.query) para obtener los datos completos del educador junto con el nombre y apellido del usuario.
*/
export const getDatosEducadorRequest = (idusuario) =>
  axios.get(`${API}/usuarios/datos-educador`, { params: { idusuario } });

export const getTotalEducadoresRequest = () => 
  axios.get(`${API}/usuarios/all`);

export const getEducadoresRequest = () => 
  axios.get(`${API}/usuarios/educadores`);

export const getUsuariosRequest = () => 
  axios.get(`${API}/usuarios`);

export const getDiferenciaEducadoresRequest = () =>
  axios.get(`${API}/usuarios/diferencia`);

export const actualizarDatosEducadorRequest = (idusuario, data) =>
  axios.put(`${API}/usuarios/datos-educador/${idusuario}`, data);

export const eliminarUsuarioRequest = (idusuario) =>
  axios.delete(`${API}/usuarios/${idusuario}`);

export const actualizarDatosUsuarioRequest = (idusuario, data) =>
  axios.put(`${API}/usuarios/datos-usuario/${idusuario}`, data);

export const registrarUsuarioSinTokenRequest = (user) =>
  axios.post(`${API}/usuarios`, user);