// frontend/src/components/Final.jsx

import { useEffect, useState, useContext, useCallback } from "react";
import ReactDOMServer from "react-dom/server"; // Para convertir React a HTML string
import { useAuth } from "../../autenticacion/context/AuthContext";
import { getDatosEducadorRequest } from "../../api/usuarios";
import { getRespuestasDetalleRequest } from "../../api/respuestas";
import { FormContext } from "../context/FormContext";
import { Spinner } from "@heroui/spinner"; // Asumo que es un componente de spinner
import PropTypes from "prop-types";
import { guardarMensajeRequest } from "./../../api/ilustraciones"; // Tu función para llamar al backend
import { useAlert } from "../../shared/context/AlertContext"; // Tu contexto para alertas

// URLs de tus imágenes de ilustración de R2
// ✨ IMPORTANTE: Reemplaza estas URLs con las URLs públicas REALES de tus SVGs en Cloudflare R2.
// Deben tener el formato: https://pub-[tu-uuid].r2.dev/nombre_del_archivo.svg
const imagenesPorRespuesta = {
  Ballenas: "https://pub-6d04f08c23914d56abf8c556fa6b0f9d.r2.dev/cetaceo.jpg",
  Focas: "https://pub-6d04f08c23914d56abf8c556fa6b0f9d.r2.dev/pinipedo.jpg",
  "Tortugas marinas":
    "https://pub-6d04f08c23914d56abf8c556fa6b0f9d.r2.dev/tortuga.jpg",
  Orcas: "https://pub-6d04f08c23914d56abf8c556fa6b0f9d.r2.dev/orca.jpg",
  Pingüinos: "https://pub-6d04f08c23914d56abf8c556fa6b0f9d.r2.dev/pinguino.jpg",
  Nutrias: "https://pub-6d04f08c23914d56abf8c556fa6b0f9d.r2.dev/mustelido.jpg",
};

const Final = ({ submitSuccess }) => {
  const { user } = useAuth();
  const { quizId, idrespuesta } = useContext(FormContext);

  const [educador, setEducador] = useState(null);
  const [respuestasDetalle, setRespuestasDetalle] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✨ Nuevo estado para controlar si la ilustración ya ha sido guardada
  const [hasIlustracionBeenSaved, setHasIlustracionBeenSaved] = useState(false);

  const { showAlert } = useAlert();

  // useEffect para obtener los datos del educador
  useEffect(() => {
    const fetchDatosEducador = async () => {
      if (!user?.idusuario) return;
      try {
        const response = await getDatosEducadorRequest(user.idusuario);
        setEducador(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del educador:", error);
      }
    };
    fetchDatosEducador();
  }, [user]);

  // useEffect para obtener las respuestas del cuestionario
  useEffect(() => {
    setLoading(true);
    const fetchRespuestas = async () => {
      try {
        const response = await getRespuestasDetalleRequest(
          user.idusuario,
          quizId
        );
        setRespuestasDetalle(response.data);
      } catch (error) {
        console.error("Error al obtener respuestas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.idusuario && quizId) {
      fetchRespuestas();
    }
  }, [user, quizId, submitSuccess]);

  // useCallback para obtener la imagen según la respuesta
  const getImagenSegunRespuesta = useCallback(() => {
    const respuesta = respuestasDetalle.find(
      (resp) => Number(resp.idpregunta) === 12
    );
    const clave = respuesta?.caracteristicaalternativa?.trim();
    return clave && imagenesPorRespuesta[clave]
      ? imagenesPorRespuesta[clave]
      : null;
  }, [respuestasDetalle]);

  // useCallback para generar la descripción HTML
  const generarDescripcion = useCallback(() => {
    const getCaracteristica = (idpregunta) => {
      const respuesta = respuestasDetalle.find(
        (resp) => String(resp.idpregunta) === String(idpregunta)
      );
      return respuesta?.caracteristicaalternativa || "No descubierto";
    };

    const getCaracteristicaLatina = (idpregunta) => {
      // Primero, obtenemos la característica original usando la función existente
      const originalCaracteristica = getCaracteristica(idpregunta);

      // Aplicamos la lógica de traducción SÓLO si es la pregunta 40
      if (String(idpregunta) === "40") {
        if (originalCaracteristica === "Migrador") {
          return "Migrare";
        } else if (originalCaracteristica === "Estivador") {
          return "Stipare";
        } else if (originalCaracteristica === "Cazador") {
          return "Captiare";
        }
      }
      // Si no es la pregunta 40, o si el valor no está mapeado,
      // devolvemos la característica original
      return originalCaracteristica;
    };

    return (
      <>
        Nombre de la especie:{" "}
        <span className="font-bold text-YankeesBlue">
          {user?.nombreusuario}
        </span>{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica(34)}
        </span>{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristicaLatina("40")}
        </span>
        <br />
        Su principal comportamiento es:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica("40")}
        </span>
        <br />
        Su capacidad de sumergirse en las profundidades alcanza hasta los:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica(9)}
        </span>
        <br />
        Su velocidad de desplazamiento es de:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica("10")}
        </span>
        .
        <br />
        La distancia que puede recorrer al salir del agua es de:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica("11")}
        </span>
        .
        <br />
        Su hábitat es:{" "}
        <span className="font-bold text-YankeesBlue">
          {educador?.paiseducador || "desconocido"}
        </span>{" "}
        y se caracteriza por tener un entorno rodeado de{" "}
        {[15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((id, index, array) => (
          <span key={id} className="font-bold text-YankeesBlue">
            {getCaracteristica(id)}
            {index < array.length - 1 ? ", " : "."}
          </span>
        ))}
        <br />
        <br />
        Su morfología es de un:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica(12)}
        </span>
        <br />
        Tiene rayas o lunares de color:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica(13)}
        </span>
        <br />
        Su tamaño es de:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica(2)}
        </span>
        <br />
        Sus ojos son:{" "}
        <span className="font-bold text-YankeesBlue">
          {getCaracteristica(3)}
        </span>
      </>
    );
  }, [
    user?.nombreusuario,
    educador?.paiseducador,
    respuestasDetalle,
  ]);

  // ✨ useEffect principal para guardar el resultado de la ilustración
  useEffect(() => {
    // Define una función async dentro de useEffect para poder usar await
    const guardarResultadoIlustracion = async () => {
      // ✨ CAMBIO IMPORTANTE: Condiciones para ejecutar el guardado UNA SOLA VEZ
      if (
        !user?.idusuario || // El usuario debe estar autenticado
        !idrespuesta || // Debe haber un ID de respuesta del cuestionario
        respuestasDetalle.length === 0 || // Las respuestas deben haber cargado
        loading || // No debe estar en estado de carga (evita disparos prematuros)
        hasIlustracionBeenSaved // ✨ Clave: Si ya se guardó con éxito, no volver a llamar
      ) {
        // console.log("Saltando guardarResultadoIlustracion debido a condiciones.");
        // Opcional: Para depuración, puedes descomentar la línea de arriba y las siguientes para ver por qué no se dispara
        // console.log({ user: user?.idusuario, idrespuesta, respuestasDetalleLength: respuestasDetalle.length, loading, hasIlustracionBeenSaved });
        return; // No ejecutar la llamada a la API
      }

      // Convertir la descripción React HTML a texto plano para el backend
      const descripcionHTML = ReactDOMServer.renderToStaticMarkup(
        generarDescripcion()
      );
      const descripcionToSend = descripcionHTML
        .replace(/<[^>]*>/g, "") // Elimina etiquetas HTML
        .replace(/\s+/g, " ") // Normaliza espacios
        .replace(/([a-z])([A-Z])/g, "$1. $2") // Agrega punto y espacio (ej. "animalTipo" -> "animal. Tipo")
        .replace(/\. ?/g, ".\n") // Agrega salto de línea después de cada punto para formato
        .trim();

      // Obtener la URL de la imagen de stock (ahora de R2)
      const imagenPerfilActual = getImagenSegunRespuesta();

      // Preparar el objeto de datos para enviar al backend
      const mensajeToSend = {
        tituloilustracion: `${user.nombreusuario} ${user.apellidousuario}`,
        descripcionilustracion: descripcionToSend,
        urlarchivoilustracion: imagenPerfilActual, // Esta URL es de R2 ahora
        ideducador: user.idusuario,
        idrespuesta: idrespuesta,
      };

      try {
        // Llama a la función de la API de tu backend para guardar el mensaje
        const respuestaDelGuardado = await guardarMensajeRequest(mensajeToSend);

        // ✨ CAMBIO IMPORTANTE: Marcar que el guardado fue exitoso
        setHasIlustracionBeenSaved(true);

        showAlert("Resultado guardado exitosamente", "success");
      } catch (err) {
        console.error("Error al guardar el resultado de la ilustración:", err);
        showAlert(
          "Error al guardar el resultado, inténtalo de nuevo más tarde",
          "warning"
        );
      }
    };

    guardarResultadoIlustracion(); // Llama a la función async que hemos definido
  }, [
    user, // Si user cambia, podría ser un nuevo usuario o recarga de sesión
    educador, // Si educador cambia, podría afectar generarDescripcion
    respuestasDetalle, // Si las respuestas cambian, queremos re-evaluar el guardado
    generarDescripcion, // Función memoizada, se recalcula si sus deps cambian
    idrespuesta, // ID de la respuesta, esencial para el guardado
    getImagenSegunRespuesta, // Función memoizada, se recalcula si sus deps cambian
    showAlert, // Función del contexto, no cambia a menudo pero es buena práctica
    loading, // ✨ NUEVA DEPENDENCIA: Para esperar que los datos terminen de cargar
    hasIlustracionBeenSaved, // ✨ NUEVA DEPENDENCIA: Para que el useEffect reaccione a su propio cambio de estado
  ]);

  // Lógica para mostrar la imagen y descripción en el JSX
  const imagenPerfil = getImagenSegunRespuesta();
  const descripcion =
    user && educador && respuestasDetalle.length > 0 ? (
      generarDescripcion()
    ) : (
      <p className="italic text-gray-500">Pronto podrás ver tu perfil aquí.</p>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-Moonstone mb-4">
          ¡Gracias por completar el cuestionario!
        </h2>
        <p className="text-gray-800 text-sm sm:text-base">
          Hemos recibido tus respuestas.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
          <div className="w-full md:w-1/2">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              {descripcion}
            </p>
          </div>

          <div className="md:w-1/2 border border-gray-300 rounded-lg p-2 bg-white">
            <div className="rounded-lg">
              {imagenPerfil ? (
                // ✨ CAMBIO: Contenedor con relación de aspecto
                // pt-[75%] significa que la altura es el 75% del ancho (relación 4:3)
                // pt-[56.25%] sería 16:9
                // pt-[100%] sería 1:1 (cuadrado)
                <div className="relative pt-[75%]">
                  <img
                    src={imagenPerfil}
                    alt="Perfil descubierto"
                    className="absolute inset-0 w-full h-full object-cover object-center" // `inset-0` es shorthand para `top-0 left-0 right-0 bottom-0`
                  />
                </div>
              ) : (
                // Para la imagen pendiente, también querrás darle una altura fija o un padding
                <p className="text-center text-gray-500 italic py-10 h-full flex items-center justify-center">
                  Imagen ilustrativa pendiente
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Final.propTypes = {
  submitSuccess: PropTypes.bool,
};

export default Final;
