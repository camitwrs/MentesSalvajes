import PropTypes from "prop-types";
import SeccionesCuestionario from "./SeccionesCuestionario";
import PreguntaTexto from "./PreguntaText";
import PreguntaRadio from "./PreguntaRadio";
import PreguntaCheckbox from "./PreguntaCheckbox";
import PreguntaSelect from "./PreguntaSelect";
import PreguntaRange from "./PreguntaRange";
import PreguntaNumber from "./PreguntaNumber";

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
    const perteneceASeccion = secciones[seccionActual]?.includes(pregunta.idpregunta);

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

  // Renderizar todas las preguntas de la sección actual
  return (
    <div>
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
            : "w-full bg-white border border-gray-400 rounded-lg p-6 transition-transform duration-300 ease-in-out mb-6";

        return (
          <div key={pregunta.idpregunta} className={preguntaClass}>
            <h2 className="text-base sm:text-xl text-center font-semibold mb-4 text-Moonstone">
              {pregunta.textopregunta}
            </h2>
            {renderInputByType(pregunta, opciones)}
            {submitError && (
              <span className="text-red-600 text-xs sm:text-sm mt-2 block">
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
