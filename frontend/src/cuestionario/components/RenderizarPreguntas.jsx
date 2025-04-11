import PropTypes from "prop-types";
import SeccionesCuestionario from "./SeccionesCuestionario";
import PreguntaTexto from "./PreguntaText";
import PreguntaRadio from "./PreguntaRadio";
import PreguntaCheckbox from "./PreguntaCheckbox";
import PreguntaSelect from "./PreguntaSelect";
import PreguntaRange from "./PreguntaRange";
import PreguntaNumber from "./PreguntaNumber";

import { Users, Link, Lightbulb } from "lucide-react";

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
    const perteneceASeccion = secciones[seccionActual]?.includes(
      pregunta.idpregunta
    );

    // Condiciones condicionales
    if (pregunta.idpregunta >= 2 && pregunta.idpregunta <= 7) {
      return userData[1] === 1 && perteneceASeccion;
    }

    if (
      pregunta.idpregunta === 8 ||
      pregunta.idpregunta === 9 ||
      pregunta.idpregunta === 10
    ) {
      return userData[7] === 40 && perteneceASeccion;
    }

    if (pregunta.idpregunta === 25) {
      return userData[24] === 96 && perteneceASeccion;
    }

    return perteneceASeccion;
  });

  // 🔧 Ordenar preguntas por ID
  const preguntasOrdenadas = [...preguntasFiltradas].sort(
    (a, b) => a.idpregunta - b.idpregunta
  );

  // Renderizar según tipo de pregunta
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
            min={1}
            max={80}
            numberError={numberError}
            setNumberError={setNumberError}
          />
        );
      default:
        return null;
    }
  };

  const titulosSecciones = {
    a: "Caracterización del rol de formador",
    b: "Caracterización profesional y sus relaciones",
    c: "Vínculo con el Emprendimiento",
  };

  const iconosSecciones = {
    a: <Users className="h-5 w-5 inline-block mr-2" />,
    b: <Link className="h-5 w-5 inline-block mr-2" />,
    c: <Lightbulb className="h-5 w-5 inline-block mr-2" />,
  };

  return (
    <div className="space-y-6">
      {/* Título de sección */}
      <h2 className="font-bold text-xl text-right text-Moonstone mb-6">
        {iconosSecciones[seccionActual]}
        {titulosSecciones[seccionActual]}
      </h2>

      {/* Preguntas */}
      {preguntasOrdenadas.map((pregunta) => {
        const opciones = (alternativas[pregunta.idpregunta] || []).sort(
          (a, b) => {
            const textoA = a.textoalternativa || "";
            const textoB = b.textoalternativa || "";
            const isNumeric =
              !isNaN(parseFloat(textoA)) && !isNaN(parseFloat(textoB));

            return isNumeric
              ? parseFloat(textoA) - parseFloat(textoB)
              : textoA.localeCompare(textoB);
          }
        );

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
