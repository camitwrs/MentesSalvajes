import PropTypes from "prop-types";
import SeccionesCuestionario from "./SeccionesCuestionario";
import PreguntaTexto from "./PreguntaText";
import PreguntaRadio from "./PreguntaRadio";
import PreguntaCheckbox from "./PreguntaCheckbox";
import PreguntaSelect from "./PreguntaSelect";
import PreguntaRange from "./PreguntaRange";
import PreguntaNumber from "./PreguntaNumber";
import {
  UserGroupIcon,
  LinkIcon,
  LightBulbIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const RenderizarPreguntas = ({
  preguntas,
  alternativas,
  seccionActual,
  userData,
  setUserData,
  checkboxError,
  setCheckboxError,
  numberError,
  setNumberError,
  submitError,
}) => {
  // Obtener las preguntas agrupadas por secciones
  const secciones = SeccionesCuestionario();
  const preguntasFiltradas = preguntas.filter((pregunta) => {
    // Filtrar preguntas por sección
    const perteneceASeccion = secciones[seccionActual]?.includes(
      pregunta.idpregunta
    );

    // Verificar si la pregunta es condicional
    if (pregunta.idpregunta === 21) {
      return userData[20] === 66 && perteneceASeccion; // Mostrar si la respuesta a la 20 es "Sí"
    }

    if (pregunta.idpregunta >= 57) {
      return userData[56] === 153 && perteneceASeccion; // Mostrar si la respuesta a la 56 es "Sí"
    }

    return perteneceASeccion;
  });

  // Renderizar la entrada según el tipo de pregunta
  const renderInputByType = (pregunta, opciones) => {
    switch (pregunta.tipopregunta) {
      case "text":
        return (
          <PreguntaTexto
            idPregunta={pregunta.idpregunta}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "radio":
        return (
          <PreguntaRadio
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "checkbox":
        return (
          <PreguntaCheckbox
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
            checkboxError={checkboxError}
            setCheckboxError={setCheckboxError}
          />
        );

      case "select":
        return (
          <PreguntaSelect
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "range":
        return (
          <PreguntaRange
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "number":
        return (
          <PreguntaNumber
            idPregunta={pregunta.idpregunta}
            userData={userData}
            setUserData={setUserData}
            min={1} // Ajusta según las necesidades
            max={80} // Ajusta según las necesidades
            numberError={numberError}
            setNumberError={setNumberError}
          />
        );

      default:
        return null;
    }
  };

  // Títulos por sección
  const titulosSecciones = {
    a: "Caracterización General",
    b: "Caracterización General",
    c: "Vínculo con el Emprendimiento",
    d: "Vínculo con el Emprendimiento",
    e: "Competencias Emprendedoras",
    f: "Competencias Emprendedoras",
    g: "Competencias Emprendedoras",
    h: "Competencias Emprendedoras",
    i: "Competencias Emprendedoras",
    j: "Caracterización de Formadores de Emprendimiento",
  };

  // Iconos por sección
  const iconosSecciones = {
    a: <UserGroupIcon className="h-5 w-5 inline-block mr-2" />,
    b: <UserGroupIcon className="h-5 w-5 inline-block mr-2" />,
    c: <LinkIcon className="h-5 w-5 inline-block mr-2" />,
    d: <LinkIcon className="h-5 w-5 inline-block mr-2" />,
    e: <LightBulbIcon className="h-5 w-5 inline-block mr-2" />,
    f: <LightBulbIcon className="h-5 w-5 inline-block mr-2" />,
    g: <LightBulbIcon className="h-5 w-5 inline-block mr-2" />,
    h: <LightBulbIcon className="h-5 w-5 inline-block mr-2" />,
    i: <LightBulbIcon className="h-5 w-5 inline-block mr-2" />,
    j: <AcademicCapIcon className="h-5 w-5 inline-block mr-2" />,
  };

  // Renderizar todas las preguntas de la sección actual
  return (
    <div className="space-y-6">
      {/* Mostrar el título de la sección actual con el icono */}
      <h2 className="font-bold text-xl text-right text-Moonstone mb-6">
        {iconosSecciones[seccionActual]} {/* Icono */}
        {titulosSecciones[seccionActual]} {/* Título */}
      </h2>

      {preguntasFiltradas.map((pregunta) => {
        const opciones = (alternativas[pregunta.idpregunta] || []).sort(
          (a, b) => {
            const textoA = a.textoalternativa || "";
            const textoB = b.textoalternativa || "";
            const isNumeric =
              !isNaN(parseFloat(textoA)) && !isNaN(parseFloat(textoB));

            if (isNumeric) {
              return parseFloat(textoA) - parseFloat(textoB);
            } else {
              return textoA.localeCompare(textoB);
            }
          }
        );

        // Clase condicional para preguntas no tipo "enunciado"
        const preguntaClass =
          pregunta.tipopregunta === "enunciado"
            ? ""
            : "border border-gray-300 rounded-xl p-6";

        return (
          <div key={pregunta.idpregunta} className={preguntaClass}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {pregunta.textopregunta}
            </h2>
            {renderInputByType(pregunta, opciones)}
            {submitError && (
              <span className="text-red-600 text-sm mt-2 block">
                {submitError}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

RenderizarPreguntas.propTypes = {
  preguntas: PropTypes.array.isRequired,
  alternativas: PropTypes.object.isRequired,
  seccionActual: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
  checkboxError: PropTypes.string,
  setCheckboxError: PropTypes.func,
  numberError: PropTypes.string,
  setNumberError: PropTypes.func,
  submitError: PropTypes.string,
};

export default RenderizarPreguntas;