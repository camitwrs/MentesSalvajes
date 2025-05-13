import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/*
  Función: guardarRespuestaRequest.
  --------------------------------------------
  Inserta en la base de datos una nueva respuesta para un usuario y un cuestionario dado.
*/
export const guardarRespuestaRequest = (respuesta) =>
  axios.post(`${API}/respuestas/enviar`, respuesta);

/*
  Función: getRespuestasDetalle.
  ---------------------------------------------
  Permite obtener las respuestas de un usuario en un cuestionario específico.
*/
export const getRespuestasDetalleRequest = (idusuario, idcuestionario) =>
  axios.get(`${API}/respuestas/texto`, {
    params: { idusuario, idcuestionario },
  });

/*
  Devuelve un:
  { "total_respuestas": 42 }
*/
export const getTotalAllRespuestasRequest = () =>
  axios.get(`${API}/respuestas`);

/*
  Estadísticas de diferencia de respuestas.
*/
export const getDiferenciaRespuestasRequest = () =>
  axios.get(`${API}/respuestas/diferencia`);

/*
  Devuelve el total de respuestas asociadas a un cuestionario.
*/
export const getTotalRespuestasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/respuestas/cuestionario/${idcuestionario}`);

/*
  Función: getHistorialRespuestasRequest
  --------------------------------------------
  Obtiene el historial de respuestas registradas por un usuario.
  - Parámetro:
      - idusuario: número.
  - Respuesta esperada:
      [
        {
          "idrespuesta": 1,
          "fecharespuesta": "2025-03-07T13:52:09.720Z",
          "idcuestionario": 1,
          "titulocuestionario": "Cuestionario de Matemáticas Básicas"
        },
        ...
      ]
*/

export const getRespuestasPorCodigoRequest = (codigosesion) =>
  axios.get(`${API}/respuestas/codigo/${codigosesion}`);

export const getHistorialRespuestasRequest = (idusuario) =>
  axios.get(`${API}/respuestas/historial/${idusuario}`);
