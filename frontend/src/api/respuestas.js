import axios from "axios";

const API = "http://localhost:3000/api";
/*
  Función: guardarRespuestaRequest.
  --------------------------------------------
  Inserta en la base de datos una nueva respuesta para un usuario y un cuestionario dado.

  - Parámetros esperados en req.body:
      - idusuario: identificador del usuario.
      - idcuestionario: identificador del cuestionario.
      - respuestas: objeto JSON (ej. {1: 102, 2: 201, ...}).
  - Respuesta:
      - En caso de éxito, devuelve un status 201 con un aviso JSON: ["Respuestas guardadas correctamente"]
      - Si hay error o el objeto "respuestas" no es válido, devuelve el error correspondiente.
*/
export const guardarRespuestaRequest = (respuesta) =>
  axios.post(`${API}/respuestas/enviar`, respuesta);

/*
  Función: getRespuestasDetalle.
  ---------------------------------------------
  Permite obtener las respuestas de un usuario en un cuestionario específico.

  - Parámetros esperados en req.query:
      - idusuario: identificador del usuario.
      - idcuestionario: identificador del cuestionario.
  - Respuesta:
      - Devuelve los detalles de la respuesta más reciente registrada por ese usuario en ese cuestionario. 
      - Contiene un array de objetos con información de cada pregunta respondida:
      [
        {
        "idrespuestadetalle": 1,
        "idrespuesta": 10,
        "idpregunta": 5,
        "respuestaelegida": "Humanidades",
        "idalternativa": 22,
        "caracteristicaalternativa": "Nutria",
        "puntajealternativa": null
        }
      ]
      - Si el usuario no tiene respuestas registradas en ese cuestionario, la API devuelve un error 404 con un mensaje indicando que no se encontraron respuestas recientes.
*/
export const getRespuestasDetalleRequest = (idusuario, idcuestionario) =>
  axios.get(`${API}/respuestas/texto`, {
    params: { idusuario, idcuestionario },
  });

/*
  devuelve un
  {
  "total_respuestas": 42
  }
*/
export const getTotalAllRespuestasRequest = () =>
  axios.get(`${API}/respuestas`);

export const getDiferenciaRespuestasRequest = () =>
  axios.get(`${API}/respuestas/diferencia`);

export const getTotalRespuestasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/respuestas/cuestionario/${idcuestionario}`);