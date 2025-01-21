export const cargarDatosCuestionario = async (idCuestionario) => {
    try {
      // Fetch de preguntas
      const responsePreguntas = await fetch(
        `http://localhost:3000/api/preguntas/cuestionario/${idCuestionario}`
      );
      let dataPreguntas = await responsePreguntas.json();
  
      // Ordenar preguntas por idPregunta
      dataPreguntas = dataPreguntas.sort((a, b) => a.idPregunta - b.idPregunta);
  
      // Fetch de alternativas
      const responseAlternativas = await fetch(
        `http://localhost:3000/api/alternativas/cuestionario/${idCuestionario}`
      );
      const dataAlternativas = await responseAlternativas.json();
  
      // Agrupar alternativas por idPregunta
      const alternativasPorPregunta = dataAlternativas.reduce((acc, alternativa) => {
        const idPregunta = alternativa.idpregunta;
        if (idPregunta) {
          if (!acc[idPregunta]) acc[idPregunta] = [];
          acc[idPregunta].push(alternativa);
        }
        return acc;
      }, {});
  
      return {
        preguntas: dataPreguntas,
        alternativas: alternativasPorPregunta,
      };
    } catch (error) {
      console.error("Error al cargar los datos del cuestionario:", error);
      throw new Error(
        "Hubo un problema al cargar el cuestionario. Por favor, intenta nuevamente más tarde."
      );
    }
  };
  