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
  Función: getAllRespuestasTextoRequest.
  ---------------------------------------------
  Recupera de la base de datos las respuestas de un usuario para un cuestionario y las transforma en formato texto.

  - Parámetros esperados en req.query:
      - idusuario: identificador del usuario.
      - idcuestionario: identificador del cuestionario.
  - Respuesta:
      - Devuelve un objeto JSON donde cada key es el id de la pregunta (como string) y su valor es el texto de la alternativa.
        Ejemplo:
          {
            "1": "Azul",
            "2": "Perro"
          }
      - Si no se encuentran respuestas, devuelve un error 404.
*/
export const getAllRespuestasTextoRequest = (idusuario, idcuestionario) =>
  axios.get(`${API}/respuestas/texto`, {
    params: { idusuario, idcuestionario },
  });
