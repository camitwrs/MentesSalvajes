import axios from "axios";

const API = "http://localhost:3000/api";

export const getAlternativasPorPreguntaRequest = (idPregunta) =>
  axios.get(`${API}/alternativas/pregunta/${idPregunta}`);

// Request a API PUIBLICA EXTERNA
export const getUniversidadesPorPaisRequest = (pais) =>
  axios.get(`http://universities.hipolabs.com/search?country=${pais}`);
