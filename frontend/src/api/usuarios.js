import axios from "axios";

const API = "http://localhost:3000/api";

export const getDatosEducadorRequest = (idusuario) =>
  axios.get(`${API}/datos-educador`, { params: { idusuario } });
