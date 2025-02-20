import axios from "./axios-config";

export const registrarEducadorRequest = (user) =>
  axios.post(`autenticacion/registro`, user);

export const loginUsuarioRequest = (credenciales) =>
  axios.post(`/autenticacion/entrar`, credenciales);

/*
export const logoutUsuarioRequest = () =>
  axios.post(
    `$/autenticacion/salir`,
    {},
    {
      withCredentials: true,
    }
  );
*/

export const verificarTokenRequest = () =>
  axios.get(`/autenticacion/verifytoken`);
