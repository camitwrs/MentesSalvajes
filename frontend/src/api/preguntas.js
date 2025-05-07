import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/*
  Función: getPreguntasPorCuestionario
  ----------------------------------------
  Parámetro:
    - idcuestionario: se recibe en req.params.
  Acción:
    - Consulta la tabla "preguntas" para obtener todas las preguntas asociadas al cuestionario especificado.
  Respuesta:
    - Devuelve un array de objetos JSON, donde cada objeto representa una pregunta.
    Ejemplo:
      [
        {
          idpregunta: 1,
          idcuestionario: 2,
          textopregunta: "¿Cuál es tu color favorito?",
          tipopregunta: "multiple"
        },
        {
          idpregunta: 2,
          idcuestionario: 2,
          textopregunta: "¿Cuál es tu animal preferido?",
          tipopregunta: "multiple"
        }
      ]
*/
export const getPreguntasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/preguntas/cuestionario/${idcuestionario}`);

/*
  Función: crearPregunta
  ----------------------------------------
  Parámetros:
    - idcuestionario, textopregunta, tipopregunta: se reciben en req.body.
  Acción:
    - Inserta una nueva pregunta en la tabla "preguntas" utilizando los datos proporcionados.
  Respuesta:
    - Devuelve un objeto JSON con un mensaje de éxito.
    Ejemplo:
      { message: "Pregunta creada exitosamente" }
*/
export const crearPreguntaRequest = (pregunta) =>
  axios.post(`${API}/preguntas`, pregunta);

/*
  Función: getPreguntasPorTipo
  ----------------------------------------
  Parámetro:
    - tipopregunta: se recibe en req.params.
  Acción:
    - Consulta la tabla "preguntas" para obtener todas las preguntas que tienen el tipopregunta especificado.
  Respuesta:
    - Devuelve un array de objetos JSON, donde cada objeto representa una pregunta que coincide con el tipo indicado.
    Ejemplo:
      [
        {
          idpregunta: 3,
          idcuestionario: 4,
          textopregunta: "¿Cuál es la capital de Francia?",
          tipopregunta: "geografía"
        },
        {
          idpregunta: 5,
          idcuestionario: 4,
          textopregunta: "¿Qué río cruza París?",
          tipopregunta: "geografía"
        }
      ]
*/
export const getPreguntasPorTipo = (tipopregunta) =>
  axios.get(`${API}/preguntas/tipo/${tipopregunta}`);

export const getTotalPreguntasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/preguntas/cuestionario/total/${idcuestionario}`);
