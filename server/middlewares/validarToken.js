// middlewares: funciones que deben ejecutarse antes de llegar a una ruta
import jwt from "jsonwebtoken";

export const autenticacionRequerida = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "no token, autorizacion denegada" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(404).json({ message: "token invalido" });

    req.user = decodedUser;

    next();
  });
};
