import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const registrarse = (user) => {

  }
  
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
