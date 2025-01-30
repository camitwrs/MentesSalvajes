import axios from "axios";

const API = "http://localhost:3000/api";

export const registrarEducadorRequest = (user) =>
  axios.post(`${API}/autenticacion/registro`, user);

export const loginUsuarioRequest = (credenciales) =>
  axios.post(`${API}/autenticacion/entrar`, credenciales, {
    withCredentials: true,
  });

export const logoutUsuarioRequest = () =>
  axios.post(
    `${API}/autenticacion/salir`,
    {},
    {
      withCredentials: true,
    }
  );
