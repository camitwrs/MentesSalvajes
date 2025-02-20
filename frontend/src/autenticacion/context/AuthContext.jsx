import { createContext, useState, useContext, useEffect } from "react";
import {
  loginUsuarioRequest,
  registrarEducadorRequest,
  verificarTokenRequest,
} from "../../api/autenticacion";
import Cookie from "js-cookie";

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
  const [loading, setLoading] = useState(true);

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
      setEstaAutenticado(true);
      setUser(res.data);
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

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookie.get();

      if (!cookies.token) {
        setEstaAutenticado(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verificarTokenRequest(cookies.token);
        if (!res.data) {
          setEstaAutenticado(false);
          setLoading(false);
          return;
        }
        setEstaAutenticado(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setEstaAutenticado(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        registrarse,
        logearse,
        user,
        estaAutenticado,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
