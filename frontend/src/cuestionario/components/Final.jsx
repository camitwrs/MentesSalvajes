import { useEffect, useState, useContext } from "react";
import ReactDOMServer from "react-dom/server";
import { useAuth } from "../../autenticacion/context/AuthContext";
import { getDatosEducadorRequest } from "../../api/usuarios";
import { getRespuestasDetalleRequest } from "../../api/respuestas";
import { FormContext } from "../context/FormContext";
import { Spinner } from "@heroui/spinner";
import PropTypes from "prop-types";
import { guardarMensajeRequest } from "./../../api/ilustraciones";

import ballenas from "../assets/cetaceo.svg";
import focas from "../assets/pinipedo.svg";
import tortugas from "../assets/tortuga.svg";
import orcas from "../assets/orca.svg";
import pinguinos from "../assets/pinguino.svg";
import nutrias from "../assets/mustelido.svg";

const imagenesPorRespuesta = {
  Ballenas: ballenas,
  Focas: focas,
  "Tortuga marinas": tortugas,
  Orcas: orcas,
  Pingüinos: pinguinos,
  Nutrias: nutrias,
};

const Final = ({ submitSuccess }) => {
  const { user } = useAuth();
  const { quizId } = useContext(FormContext);

  const [educador, setEducador] = useState(null);
  const [respuestasDetalle, setRespuestasDetalle] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const timer = setTimeout(async () => {
      const response = await getRespuestasDetalleRequest(
        user.idusuario,
        quizId
      );
      setRespuestasDetalle(response.data);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, quizId, submitSuccess]);

  const getCaracteristica = (idpregunta) => {
    const respuesta = respuestasDetalle.find(
      (resp) => String(resp.idpregunta) === String(idpregunta)
    );
    return respuesta?.caracteristicaalternativa || "desconocido";
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

  const calcularCategoria = () => {
    const setAIds = [41, 42, 43, 44, 45];
    const setBIds = [46, 47, 48, 49, 50];
    const setCIds = [51, 52, 53, 54, 55];

    const sumarPuntaje = (ids) =>
      respuestasDetalle
        .filter((resp) => ids.includes(Number(resp.idpregunta)))
        .reduce(
          (total, resp) => total + (Number(resp.puntajealternativa) || 0),
          0
        );

    const setA = sumarPuntaje(setAIds);
    const setB = sumarPuntaje(setBIds);
    const setC = sumarPuntaje(setCIds);

    if (setA > setB && setA > setC) return "Cazador";
    if (setB > setA && setB > setC) return "Estivador";
    if (setC > setA && setC > setB) return "Migrar";
    return "Desconocido";
  };

  const getImagenSegunRespuesta = () => {
    const respuesta = respuestasDetalle.find(
      (resp) => Number(resp.idpregunta) === 8
    );
    return respuesta
      ? imagenesPorRespuesta[respuesta.caracteristicaalternativa]
      : null;
  };

  const generarDescripcion = () => (
    <>
      El profesor{" "}
      <span className="font-bold text-YankeesBlue">
        {user?.nombreusuario} {user?.apellidousuario}
      </span>
      . Su especie animal es{" "}
      <span className="font-bold text-YankeesBlue">{calcularCategoria()}</span>{" "}
      <span className="font-bold text-YankeesBlue">
        {getRespuestaElegida(28)}
      </span>{" "}
      de{" "}
      <span className="font-bold text-YankeesBlue">
        {educador?.paiseducador || "desconocido"}
      </span>
      . Su capacidad de sumergirse en las profundidades alcanza hasta los{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("60")}
      </span>
      . Su velocidad de nado es de{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("61")}
      </span>
      . La distancia que puede recorrer al salir del agua es de{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("62")}
      </span>
      . Su morfología es de un{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("8")}
      </span>
      . Tiene{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("9")}
      </span>
      . Su tamaño es de{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("21")}
      </span>
      . Sus ojos son{" "}
      <span className="font-bold text-YankeesBlue">
        {getCaracteristica("23")}
      </span>
      . Su hábitat está compuesto por:{" "}
      {["11", "12", "13", "14", "15", "16", "17", "18", "19"].map(
        (id, index, array) => (
          <span key={id} className="font-bold text-YankeesBlue">
            {getCaracteristica(id)}
            {index < array.length - 1 ? ", " : "."}
          </span>
        )
      )}
    </>
  );

  const descripcion = generarDescripcion();
  const titulo = `${user?.nombreusuario} ${user?.apellidousuario}`;
  const descripcionHTML = ReactDOMServer.renderToStaticMarkup(
    generarDescripcion()
  ); // Convierte JSX a HTML string
  const descripcionToSend = descripcionHTML.replace(/<[^>]*>/g, ""); // Limpia etiquetas HTML
  const idEducador = user?.idusuario;

  const mensajeToSend = {
    tituloilustracion: titulo,
    descripcionllustracion: descripcionToSend,
    ideducador: idEducador,
  };

  useEffect(() => {
    guardarMensajeRequest(mensajeToSend)
      .then((response) => {
        console.log("Mensaje enviado correctamente:", response.data);
      })
      .catch((error) => {
        console.error("Error al enviar el mensaje:", error);
      });
  }, []); // Se ejecuta solo una vez al montar el componente

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
        <>
          {respuestasDetalle.length > 0 && (
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
              <div className="w-full md:w-1/2">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  {descripcion}
                </p>
              </div>

              <div className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 bg-white shadow-md">
                <div className="relative h-[250px] md:h-[400px] w-full rounded-lg overflow-hidden flex justify-center">
                  {getImagenSegunRespuesta() ? (
                    <img
                      src={getImagenSegunRespuesta()}
                      alt="Perfil descubierto"
                      className="object-contain h-full w-full"
                    />
                  ) : (
                    <p className="text-center text-gray-500">
                      No hay imagen disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

Final.propTypes = {
  submitSuccess: PropTypes.bool,
};

export default Final;
