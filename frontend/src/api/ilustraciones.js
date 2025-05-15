import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/*
guardarMensajeRequest

Esta petición permite guardar una nueva ilustración en la base de datos.

Solicitud (Request)
Cuerpo de la solicitud (JSON):
{
  "tituloilustracion": "Nombre de la ilustración",
  "descripcionllustracion": "Descripción detallada de la ilustración",
  "ideducador": 5
}

Respuesta (Response)
Si la ilustración se guarda correctamente, devuelve:
{
  "mensaje": "Ilustración guardada con éxito",
  "ilustracion": {
    ...
  }
}

Si ocurre un problema en el servidor, devuelve:
{
  "error": "Error interno del servidor"
}

*/

export const guardarMensajeRequest = (mensaje) =>
  axios.post(`${API}/ilustraciones/guardar-mensaje`, mensaje);

/*
getAllIlustracionesRequest

Recupera todas las ilustraciones almacenadas en la base de datos, ordenadas por idilustracion en orden descendente (de la más reciente a la más antigua).

Solicitud (Request)
Cuerpo de la solicitud: No requiere parámetros

Respuesta (Response)
Si la consulta es exitosa, devuelve un array de ilustraciones:
[
  {
    ...
  },
  {
    ...
  }
]

Si ocurre un problema en el servidor, devuelve:
{
  "error": "Error interno del servidor"
}
*/


export const getAllIlustracionesRequest = () =>
  axios.get(`${API}/ilustraciones`);

/*
guardarArchivoRequest

Recibe un archivo (archivoilustracion), junto con los IDs de un diseñador (iddisenador) y una ilustración (idilustracion).

Si la petición es exitosa (status 200), devuelve un JSON (response.data) con:
{
  "mensaje": "Archivo subido con éxito",
  "ilustracion": {
    ...
  },
  "url": "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones/1711382978392_imagen.png"
}
  
Si hay un error, devuelve una respuesta con status 400, 404 o 500 y un JSON como:
{ "error": "Error subiendo archivoilustracion a storage" }
 o
{ "error": "Ilustración no encontrada" }

*/

export const guardarArchivoRequest = (archivo) =>
  axios.post(`${API}/ilustraciones/guardar-archivo`, archivo);

export const getArchivoRequest = (idrespuesta) =>
  axios.post(`${API}/ilustraciones/guardar-archivo`, archivo);