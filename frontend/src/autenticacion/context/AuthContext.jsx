/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import {
  loginUsuarioRequest,
  registrarEducadorRequest,
  verificarTokenRequest,
} from "../../api/autenticacion";
import Cookie from "js-cookie";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const registrarse = async (user) => {
    try {
      const res = await registrarEducadorRequest(user);
      setUser(res.data);
      setEstaAutenticado(false);
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data))
          return setErrors(error.response.data);
        setErrors([error.response.data.message]);
      } else {
        console.log("Error de conexión o respuesta no disponible:", error);
        setErrors(["Error de conexión. Inténtalo de nuevo más tarde."]);
      }
    }
  };

  const logearse = async (user) => {
    try {
      const res = await loginUsuarioRequest(user);
      setEstaAutenticado(true);
      setUser(res.data);
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data))
          return setErrors(error.response.data);
        setErrors([error.response.data.message]);
      } else {
        console.log("Error de conexión o respuesta no disponible:", error);
        setErrors(["Error de conexión. Inténtalo de nuevo más tarde."]);
      }
    }
  };

  const logout = () => {
    Cookie.remove("token");
    setUser(null);
    setEstaAutenticado(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookie.get();

      if (!cookies.token) {
        setUser(null);
        setEstaAutenticado(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verificarTokenRequest(cookies.token);
        if (res.data) {
          setUser(res.data);
          setEstaAutenticado(true);
        } else {
          setUser(null);
          setEstaAutenticado(false);
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        setUser(null);
        setEstaAutenticado(false);
      } finally {
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
        logout,
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

// Validación de las props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Exportación directa del useAuth
export const useAuth = () => useContext(AuthContext);
