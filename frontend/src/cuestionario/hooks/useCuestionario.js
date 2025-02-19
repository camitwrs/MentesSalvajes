import { useState, useEffect } from "react";
import { cargarDatosCuestionario } from "../utils/cargaDatosCuestionario";

export const useCuestionario = (idCuestionario) => {
  const [preguntas, setPreguntas] = useState([]);
  const [alternativas, setAlternativas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { preguntas, alternativas } = await cargarDatosCuestionario(
          idCuestionario
        );
        setPreguntas(preguntas);
        setAlternativas(alternativas);
        setIsLoading(false);
      } catch (error) {
        setLoadError(error.message);
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, [idCuestionario]);

  return { preguntas, alternativas, isLoading, loadError };
};
