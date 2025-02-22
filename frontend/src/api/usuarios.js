import axios from "axios";

const API = "http://localhost:3000/api";

/*
Función: getDatosEducadorRequest.
--------------------------------------------
Consulta la base de datos usando el idusuario (proporcionado en req.query) para obtener los datos completos del educador junto con el nombre y apellido del usuario.
*/
export const getDatosEducadorRequest = (idusuario) =>
  axios.get(`${API}/datos-educador`, { params: { idusuario } });
