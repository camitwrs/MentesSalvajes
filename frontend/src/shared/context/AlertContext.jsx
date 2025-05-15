// src/context/AlertContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { Alert } from "@heroui/alert"; // Asegúrate que la ruta sea correcta

// 1. Crear el Contexto
const AlertContext = createContext();

// 2. Crear el Proveedor del Contexto
export const AlertProvider = ({ children }) => {
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    message: "",
    type: "success",
    duration: 5000,
  });
  const [timeoutId, setTimeoutId] = useState(null);

  const hideAlert = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setAlertInfo((prev) => ({ ...prev, visible: false }));
  }, [timeoutId]);

  const showAlert = useCallback(
    (message, type = "success", duration) => {
      const alertDuration = duration ?? alertInfo.duration;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setAlertInfo({ visible: true, message, type, duration: alertDuration });
      const newTimeoutId = setTimeout(() => {
        hideAlert();
      }, alertDuration);
      setTimeoutId(newTimeoutId);
    },
    [hideAlert, timeoutId, alertInfo.duration]
  );

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertInfo.visible && (
        <div className="fixed bottom-5 left-5 z-50 max-w-sm w-full animate-fade-in">
          <Alert
            type={alertInfo.type}
            color={alertInfo.type}
            variant="solid"
            radius="full"
            onClose={hideAlert}
          >
            {alertInfo.message}
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert debe ser usado dentro de un AlertProvider");
  }
  return context;
};
