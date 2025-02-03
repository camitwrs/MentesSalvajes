import { createContext, useState, useContext } from "react";
import { registrarEducadorRequest } from "../../api/autenticacion";

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
  const [registerErrors, setRegisterErrors] = useState([]);

  const registrarse = async (user) => {
    try {
      const res = await registrarEducadorRequest(user);
      console.log(res.data);
      setUser(res.data);
      setEstaAutenticado(true);
    } catch (error) {
      setRegisterErrors(error.response.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        registrarse,
        user,
        estaAutenticado,
        registerErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
