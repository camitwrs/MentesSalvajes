// Manejar cambios en inputs tipo radio y select
export const handleInputChange = (e, preguntas, currentQuestionIndex, setUserData, userData) => {
    const idPregunta = preguntas[currentQuestionIndex].idPregunta;
    const value = parseInt(e.target.value, 10); // Convertir a número
    setUserData({
      ...userData,
      [idPregunta]: value, // idAlternativa como número
    });
  };
  
  // Manejar cambios en inputs tipo checkbox
  export const handleCheckboxChange = (
    e,
    preguntas,
    currentQuestionIndex,
    setUserData,
    userData,
    setCheckboxError,
    submitError,
    setSubmitError
  ) => {
    const idPregunta = preguntas[currentQuestionIndex].idPregunta;
    const selectedId = parseInt(e.target.value, 10); // Convertir a número
    const updatedSelections = Array.isArray(userData[idPregunta])
      ? userData[idPregunta]
      : [];
  
    // Limitar la selección a 2 para la pregunta 8
    if (idPregunta === 8 && updatedSelections.length >= 2 && e.target.checked) {
      setCheckboxError(
        "Puedes seleccionar un máximo de 2 opciones para esta pregunta."
      );
      return;
    }
  
    let newSelections;
    if (e.target.checked) {
      newSelections = [...updatedSelections, selectedId];
      setCheckboxError(""); // Limpiar error si todo es válido
    } else {
      newSelections = updatedSelections.filter((id) => id !== selectedId);
    }
  
    setUserData({
      ...userData,
      [idPregunta]: newSelections,
    });
  
    if (submitError) setSubmitError("");
  };
  
  // Validar el input actual
  export const validateCurrentInput = (
    preguntas,
    currentQuestionIndex,
    userData,
    MIN_NUMBER,
    MAX_NUMBER,
    setNumberError
  ) => {
    const pregunta = preguntas[currentQuestionIndex];
    if (!pregunta) return;
  
    if (pregunta.tipopregunta === "number") {
      const value = userData[pregunta.idpregunta];
      if (value !== undefined && value !== "") {
        if (value < MIN_NUMBER) {
          setNumberError(`El número debe ser al menos ${MIN_NUMBER}.`);
        } else if (value > MAX_NUMBER) {
          setNumberError(`El número no puede exceder ${MAX_NUMBER}.`);
        } else {
          setNumberError(""); // Limpiar error si el valor es válido
        }
      } else {
        setNumberError(""); // Limpiar error si el campo está vacío
      }
    }
  };  