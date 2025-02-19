import axios from "axios";

const API = "http://localhost:3000/api";

export const getAlternativasPorPreguntaRequest = (idpregunta) =>
  axios.get(`${API}/alternativas/pregunta/${idpregunta}`);

export const getAlternativasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/alternativas/cuestionario/${idcuestionario}`);

export const crearAlternativaRequest = (alternativa) =>
  axios.post(`${API}/alternativas`, alternativa);

// Petición a API PUIBLICA EXTERNA
export const getUniversidadesPorPaisRequest = (nombrepais) =>
  axios.get(`http://universities.hipolabs.com/search?country=${nombrepais}`);
