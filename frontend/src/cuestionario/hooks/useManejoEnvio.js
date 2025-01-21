import { useState } from "react";

export const useManejoEnvio = (submitData) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSendQuiz = async () => {
    setIsSubmitting(true);
    try {
      await submitData();
      setSubmitSuccess(true);
      setSubmitError("");
    } catch (error) {
      console.error("Error al enviar el cuestionario:", error);
      setSubmitError(
        "Hubo un problema al enviar el cuestionario. Por favor, intenta nuevamente."
      );
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitSuccess,
    submitError,
    handleSendQuiz,
  };
};
