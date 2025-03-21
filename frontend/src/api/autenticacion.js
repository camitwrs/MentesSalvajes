import axios from "./axios-config";

/*
  Función: registrarEducador
  Guarda los datos en la bd del registro del educador, formulario de RegisterPage.
  ---------------------
  Parámetros (req.body):
    - Datos de usuario: nombreusuario, apellidousuario, correousuario, contrasenausuario.
    - Datos del educador: tituloprofesionaleducador, intereseseducador, paiseducador, edadeducador, institucioneducador, sexoeducador, anosexperienciaeducador.
  Acción:
    - Verifica si el usuario ya existe (por correousuario).
    - Si no existe, hashea la contraseña y crea el registro en la tabla "usuarios" con idrol = 1 (educador).
    - Obtiene el idusuario generado y lo utiliza para insertar datos en la tabla "educadores".
    - Crea un token de acceso y lo establece en una cookie.
  Respuesta:
    - Devuelve un objeto JSON con los datos del usuario registrado:
      {
        idusuario: number,
        nombreusuario: string,
        apellidousuario: string,
        correousuario: string,
        idrol: number
      }
    - En caso de error, devuelve un status 400 con un mensaje de error.
*/
export const registrarEducadorRequest = (user) =>
  axios.post(`autenticacion/registroeducador`, user);

/*
  Función: registrarUsuario
  --------------------
  Parámetros (req.body):
    - Datos básicos del usuario: nombreusuario, apellidousuario, correousuario, contrasenausuario.
    - idrol: rol asignado (por ejemplo, (2) Admin, (4) Ilustrador, (3) Revisor).
  Acción:
    - Verifica si ya existe un usuario con el mismo correo.
    - Hashea la contraseña y crea el usuario en la tabla "usuarios".
    - Crea un token de acceso y lo establece en una cookie.
  Respuesta:
    - Devuelve un objeto JSON con los datos del usuario registrado:
      {
        idusuario: number,
        nombreusuario: string,
        apellidousuario: string,
        correousuario: string,
        idrol: number
      }
    - En caso de error, devuelve un status 400 con un mensaje de error.
*/
export const registrarUsuarioRequest = (user) =>
  axios.post(`autenticacion/registrousuario`, user);

/*
  loginUsuario
  ---------------
  Parámetros (req.body):
    - correousuario: correo del usuario.
    - contrasenausuario: contraseña en texto plano.
  Acción:
    - Busca el usuario en la tabla "usuarios" por el correo.
    - Compara la contraseña ingresada con la almacenada (hasheada).
    - Si la autenticación es exitosa, genera un token de acceso y lo envía en una cookie.
  Respuesta:
    - Devuelve un objeto JSON con los datos del usuario autenticado:
      {
        idusuario: number,
        nombreusuario: string,
        apellidousuario: string,
        correousuario: string,
        idrol: number
      }
    - En caso de error (usuario no encontrado o contraseña incorrecta), devuelve un status 400 o 401.
*/
export const loginUsuarioRequest = (credenciales) =>
  axios.post(`/autenticacion/entrar`, credenciales, { withCredentials: true });

/*
  logoutUsuario
  ---------------
  Acción:
    - Elimina la cookie "token" estableciendo su fecha de expiración en el pasado.
  Respuesta:
    - Devuelve un status 200 indicando que el usuario s e ha desconectado correctamente.
*/

export const logoutUsuarioRequest = () =>
  axios.post(
    `/autenticacion/salir`,
    {},
    {
      withCredentials: true,
    }
  );

/*
  Funcion: perfilUsuario
  ---------------
  Parámetros:
    - Se obtiene el idusuario a partir de req.user (extraído del token de autenticación).
  Acción:
    - Consulta la base de datos para obtener el perfil del usuario, incluyendo información de roles mediante un JOIN con la tabla "roles".
  Respuesta:
    - Devuelve un objeto JSON con el perfil del usuario, por ejemplo:
      {
        nombreusuario: string,
        apellidousuario: string,
        correousuario: string,
        fecharegistrousuario: date,
        nombrerol: string
      }
    - Si no se encuentra el usuario, devuelve un error 404.
*/
export const perfilUsuarioRequest = () => axios.get(`/autenticacion/perfil`);

/*
  Funcion: verificarToken
  ---------------
  Parámetros:
    - Se espera que el token esté en las cookies (req.cookies.token).
  Acción:
    - Verifica el token usando la clave secreta definida en process.env.JWT_SECRET.
    - Si el token es válido, busca al usuario en la base de datos usando el id del token.
  Respuesta:
    - Si el token es válido y el usuario existe, devuelve un objeto JSON con:
      {
        idusuario: number,
        nombreusuario: string,
        apellidousuario: string,
        correousuario: string,
        idrol: number
      }
    - Si no, devuelve un status 401 con el mensaje correspondiente.
*/
export const verificarTokenRequest = () =>
  axios.get(`/autenticacion/verifytoken`);
