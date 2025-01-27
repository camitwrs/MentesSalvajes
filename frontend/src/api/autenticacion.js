import axios from "axios";

const API = "http://localhost:3000/api";

export const registrarEducadorRequest = (user) =>
  axios.post(`${API}/autenticacion/registro`, user);
