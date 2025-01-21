import PreguntaTipoTexto from "./PreguntaTipoText";
import PreguntaTipoRadio from "./PreguntaTipoRadio";
import PreguntaTipoCheckbox from "./PreguntaTipoCheckbox";
import PreguntaTipoSelect from "./PreguntaTipoSelect";
import PreguntaTipoRange from "./PreguntaTipoRange";
import PreguntaTipoNumber from "./PreguntaTipoNumber";

const ContenidoCuestionario = ({
  preguntas,
  alternativas,
  currentQuestionIndex,
  userData,
  setUserData,
  checkboxError,
  setCheckboxError,
  numberError,
  setNumberError,
  submitError,
}) => {
  // Renderizar la entrada según el tipo de pregunta
  const renderInputByType = (pregunta, opciones) => {
    switch (pregunta.tipopregunta) {
      case "text":
        return (
          <PreguntaTipoTexto
            idPregunta={pregunta.idpregunta}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "radio":
        return (
          <PreguntaTipoRadio
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "checkbox":
        return (
          <PreguntaTipoCheckbox
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
          <PreguntaTipoSelect
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "range":
        return (
          <PreguntaTipoRange
            idPregunta={pregunta.idpregunta}
            opciones={opciones}
            userData={userData}
            setUserData={setUserData}
          />
        );

      case "number":
        return (
          <PreguntaTipoNumber
            idPregunta={pregunta.idpregunta}
            userData={userData}
            setUserData={setUserData}
            min={18} // Ajusta según las necesidades
            max={80} // Ajusta según las necesidades
            numberError={numberError}
            setNumberError={setNumberError}
          />
        );

      default:
        return null;
    }
  };

  // Renderizar la pregunta actual
  const renderQuestion = () => {
    const pregunta = preguntas[currentQuestionIndex];
    if (!pregunta) return null;

    const opciones = (alternativas[pregunta.idpregunta] || []).sort((a, b) => {
      const textoA = a.textoalternativa || "";
      const textoB = b.textoalternativa || "";
      const isNumeric =
        !isNaN(parseFloat(textoA)) && !isNaN(parseFloat(textoB));

      if (isNumeric) {
        return parseFloat(textoA) - parseFloat(textoB);
      } else {
        return textoA.localeCompare(textoB);
      }
    });

    return (
      <div className="w-full transition-opacity duration-300 ease-in-out">
        <h2 className="text-xl text-center sm:text-2xl font-semibold mb-4 text-Moonstone">
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
  };

  return renderQuestion();
};

export default ContenidoCuestionario;
