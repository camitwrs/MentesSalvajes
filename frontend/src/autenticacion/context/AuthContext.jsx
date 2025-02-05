import { createContext, useState, useContext, useEffect } from "react";
import {
  loginUsuarioRequest,
  registrarEducadorRequest,
} from "../../api/autenticacion";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [errors, setErrors] = useState([]);

  const registrarse = async (user) => {
    try {
      const res = await registrarEducadorRequest(user);
      console.log(res.data);
      setUser(res.data);
      setEstaAutenticado(true);
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data))
          return setErrors(error.response.data);
        setErrors([error.response.data.message]);
      } else {
        console.log("Error de conexión o respuesta no disponible:", error);
        setErrors(["Error de conexión. Inténtalo de nuevo más tarde."]); // Mensaje genérico
      }
    }
  };

  const logearse = async (user) => {
    try {
      const res = await loginUsuarioRequest(user);
      console.log(res);
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data))
          return setErrors(error.response.data);
        setErrors([error.response.data.message]);
      } else {
        console.log("Error de conexión o respuesta no disponible:", error);
        setErrors(["Error de conexión. Inténtalo de nuevo más tarde."]); // Mensaje genérico
      }
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 10000); // despues de 10 segundos se borran los errores
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{
        registrarse,
        logearse,
        user,
        estaAutenticado,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
