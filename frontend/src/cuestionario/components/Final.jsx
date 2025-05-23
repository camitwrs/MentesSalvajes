import { useEffect, useState, useContext, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import { useAuth } from "../../autenticacion/context/AuthContext";
import { getDatosEducadorRequest } from "../../api/usuarios";
import { getRespuestasDetalleRequest } from "../../api/respuestas";
import { FormContext } from "../context/FormContext";
import { Spinner } from "@heroui/spinner";
import PropTypes from "prop-types";
import { guardarMensajeRequest } from "./../../api/ilustraciones";
import { useAlert } from "../../shared/context/AlertContext";

const imagenesPorRespuesta = {
  Ballenas:
    "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones//cetaceo.svg",
  Focas:
    "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones//pinipedo.svg",
  "Tortugas marinas":
    "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones//tortuga.svg",
  Orcas:
    "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones//orca.svg",
  Pingüinos:
    "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones//pinguino.svg",
  Nutrias:
    "https://doqdfqrenenggbljmhdh.supabase.co/storage/v1/object/public/ilustraciones//mustelido.svg",
};

const Final = ({ submitSuccess }) => {
  const { user } = useAuth();
  const { quizId, idrespuesta } = useContext(FormContext);

  const [educador, setEducador] = useState(null);
  const [respuestasDetalle, setRespuestasDetalle] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

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

  const getImagenSegunRespuesta = () => {
    const respuesta = respuestasDetalle.find(
      (resp) => Number(resp.idpregunta) === 12
    );

    const clave = respuesta?.caracteristicaalternativa?.trim(); // Elimina espacios

    return clave && imagenesPorRespuesta[clave]
      ? imagenesPorRespuesta[clave]
      : null;
  };

  const generarDescripcion = useCallback(() => {
    const getCaracteristica = (idpregunta) => {
      const respuesta = respuestasDetalle.find(
        (resp) => String(resp.idpregunta) === String(idpregunta)
      );
      return respuesta?.caracteristicaalternativa || "No descubierto";
    };

    const getRespuestaElegida = (idpregunta) => {
      const respuesta = respuestasDetalle.find(
        (resp) => Number(resp.idpregunta) === Number(idpregunta)
      );
      if (!respuesta?.respuestaelegida) return "desconocido";
      const palabras = respuesta.respuestaelegida.trim().split(" ");
      return palabras.length > 1
        ? palabras[palabras.length - 1]
        : respuesta.respuestaelegida;
    };

    return (
      <>
        Nombre de la especie:{" "}
        <span className="font-bold text-YankeesBlue">
          {user?.nombreusuario} {user?.apellidousuario}
        </span>{" "}
        <span className="font-bold text-YankeesBlue">
          {getRespuestaElegida("32")}
        </span>{" "}
        <span className="font-bold text-YankeesBlue">
          {getRespuestaElegida("37")}
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
    user?.apellidousuario,
    educador?.paiseducador,
    respuestasDetalle,
  ]);

  useEffect(() => {
    // Define una función async dentro de useEffect para poder usar await
    const guardarResultadoIlustracion = async () => {
      // Condiciones para ejecutar el guardado
      const descripcionHTML = ReactDOMServer.renderToStaticMarkup(
        generarDescripcion()
      );

      const descripcionToSend = descripcionHTML
        .replace(/<[^>]*>/g, "") // Elimina etiquetas HTML
        .replace(/\s+/g, " ") // Normaliza espacios
        .replace(/([a-z])([A-Z])/g, "$1. $2") // Agrega punto y espacio
        .replace(/\. ?/g, ".\n") // Salto de línea después de cada punto
        .trim();

      const imagenPerfilActual = getImagenSegunRespuesta(); // Llama a la función memoizada

      const mensajeToSend = {
        tituloilustracion: `${user.nombreusuario} ${user.apellidousuario}`,
        descripcionilustracion: descripcionToSend,
        urlarchivoilustracion: imagenPerfilActual, // Usa la variable correcta
        ideducador: user.idusuario, // Asegúrate que este sea el ID correcto
        idrespuesta: idrespuesta,
      };

      try {
        // Llama a guardarMensajeRequest y espera su resultado
        const respuestaDelGuardado = await guardarMensajeRequest(mensajeToSend);

        showAlert("Resultado guardado exitosamente", "success");
      } catch (err) {
        showAlert(
          "Error al guardar el resultado, inténtalo de nuevo más tarde",
          "warning"
        );
      }
    };

    guardarResultadoIlustracion(); // Llama a la función async
  }, [
    user,
    educador,
    respuestasDetalle,
    generarDescripcion,
    idrespuesta, // Asegúrate que idrespuesta venga del FormContext y esté disponible
    getImagenSegunRespuesta, // Función memoizada
    showAlert, // Función del contexto de alerta
  ]);

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

          <div className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 bg-white shadow-md">
            <div className="relative h-[250px] md:h-[400px] w-full rounded-lg overflow-hidden flex justify-center">
              {imagenPerfil ? (
                <img
                  src={imagenPerfil}
                  alt="Perfil descubierto"
                  className="object-contain h-full w-full"
                />
              ) : (
                <p className="text-center text-gray-500 italic">
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
