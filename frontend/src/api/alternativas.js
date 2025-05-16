import axios from "axios";

const API = import.meta.env.VITE_API_URL;
//const PAIS_URL = process.env.REACT_APP_PAISES_API_URL;
/*
  Funcion: getAlternativasPorPregunta
  ----------------------------------------
  Parámetros:
    - idpregunta (req.params): Identificador de la pregunta.
  Acción:
    - Consulta la tabla "alternativas" para obtener todas las alternativas asociadas a la pregunta especificada.
  Respuesta:
    - Devuelve un array JSON con los registros de las alternativas correspondientes a esa pregunta.
    Ejemplo de respuesta:
      [
        { idalternativa: 3, idpregunta: 10, textoalternativa: "Opción 1", caracteristicaalternativa: "valor1" },
        { idalternativa: 4, idpregunta: 10, textoalternativa: "Opción 2", caracteristicaalternativa: "valor2" }
      ]
*/
export const getAlternativasPorPreguntaRequest = (idpregunta) =>
  axios.get(`${API}/alternativas/pregunta/${idpregunta}`);

/*
  Funcion: getAlternativasPorCuestionario
  ----------------------------------------
  Parámetros:
    - idcuestionario (req.params): Identificador del cuestionario.
  Acción:
    - Realiza una consulta que une las tablas "alternativas" y "preguntas" para obtener todas las alternativas de las preguntas que pertenecen al cuestionario especificado.
  Respuesta:
    - Devuelve un array JSON con los registros de las alternativas.
    Ejemplo de respuesta:
      [
        { idalternativa: 1, idpregunta: 5, textoalternativa: "Opción A", caracteristicaalternativa: "valor1" },
        { idalternativa: 2, idpregunta: 5, textoalternativa: "Opción B", caracteristicaalternativa: "valor2" },
        ...
      ]
*/
export const getAlternativasPorCuestionarioRequest = (idcuestionario) =>
  axios.get(`${API}/alternativas/cuestionario/${idcuestionario}`);

/*
  Funcion: crearAlternativa
  ----------------------------------------
  Parámetros (req.body):
    - idpregunta: Identificador de la pregunta a la que pertenece la alternativa.
    - textoalternativa: Texto descriptivo de la alternativa.
    - caracteristicaalternativa: Característica adicional o valor asociado a la alternativa.
  Acción:
    - Inserta una nueva alternativa en la tabla "alternativas" usando los datos proporcionados.
  Respuesta:
    - Devuelve un objeto JSON con un mensaje confirmando la creación exitosa de la alternativa.
    Ejemplo de respuesta:
      { message: "Alternativa creada exitosamente" }
*/
export const crearAlternativaRequest = (alternativa) =>
  axios.post(`${API}/alternativas`, alternativa);

/*
getTotalAlternativasRespondidasRequest

Formato respuesta:
[
  {
    "idpregunta": 1,
    "alternativas": [
      {
        "idalternativa": 1,
        "total_respuestas": 10
      },
      {
        "idalternativa": 2,
        "total_respuestas": 5
      }
    ]
  },
  {
    "idpregunta": 2,
    "alternativas": [
      {
        "idalternativa": 3,
        "total_respuestas": 7
      }
    ]
  }
]
*/

export const getTotalAlternativasRespondidasRequest = () =>
  axios.get(`${API}/alternativas/all`);

export const actualizarAlternativaRequest = (idalternativa, alternativa) =>
  axios.put(`${API}/alternativas/${idalternativa}`, alternativa);

export const eliminarAlternativaRequest = (idalternativa) =>
  axios.delete(`${API}/alternativas/${idalternativa}`);



