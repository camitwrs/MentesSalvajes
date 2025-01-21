import { useEffect } from "react";

export const useInicializarAlternativas = (preguntas, currentQuestionIndex, alternativas, userData, setUserData) => {
  useEffect(() => {
    const pregunta = preguntas[currentQuestionIndex];
    if (pregunta && pregunta.tipopregunta === "range") {
      const idPregunta = pregunta.idpregunta;
      const opciones = alternativas[idPregunta];

      if (opciones && opciones.length > 0) {
        const primeraOpcionId = opciones[0].idalternativa;

        if (!userData[idPregunta]) {
          setUserData((prev) => ({
            ...prev,
            [idPregunta]: primeraOpcionId,
          }));
        }
      }
    }
  }, [preguntas, currentQuestionIndex, alternativas, userData, setUserData]);
};
