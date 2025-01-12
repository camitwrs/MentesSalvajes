import React, { useState, createContext, useEffect } from "react";

// Crea el contexto fuera del componente
export const FormContext = createContext();

const FormProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState({});
  const [finalData, setFinalData] = useState([]);

  function submitData() {
    setFinalData((prevFinalData) => [...prevFinalData, userData]);
    setUserData({});
    setCurrentQuestionIndex(0);
  }

  useEffect(() => {
    console.log("userData actualizado:", userData);
  }, [userData]);

  useEffect(() => {
    console.log("finalData actualizado:", finalData);
  }, [finalData]);

  return (
    <FormContext.Provider
      value={{
        currentQuestionIndex,
        setCurrentQuestionIndex,
        userData,
        setUserData,
        finalData,
        setFinalData,
        submitData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
