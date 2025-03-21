/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import {
  loginUsuarioRequest,
  registrarEducadorRequest,
  verificarTokenRequest,
} from "../../api/autenticacion";
import Cookie from "js-cookie";
import PropTypes from "prop-types";
import { Spinner } from "@heroui/spinner";

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

      if (res.data) {
        setLoading(true); // Activamos el spinner SOLO si la autenticación es exitosa

        setTimeout(() => {
          setEstaAutenticado(true);
          setUser(res.data);
          setLoading(false); // Desactivamos el spinner después del delay
        }, 1500); // Delay de 1.5 segundos antes de redirigir
      }
    } catch (error) {
      setLoading(false); // Si hay error, asegurarnos de que el spinner NO aparezca

      if (error.response) {
        if (Array.isArray(error.response.data)) {
          return setErrors(error.response.data);
        }
        setErrors([error.response.data.message]);
      } else {
        console.log("Error de conexión o respuesta no disponible:", error);
        setErrors(["Error de conexión. Inténtalo de nuevo más tarde."]);
      }
    }
  };

  const logout = () => {
    Cookie.remove("token");
    localStorage.removeItem("quizId");
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
      try {
        const res = await verificarTokenRequest(); // SIN leer cookie manualmente
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-600 font-semibold text-lg">
          Procesando, por favor espera...
        </p>
      </div>
    );
  }

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
