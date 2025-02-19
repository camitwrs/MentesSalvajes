import { z } from "zod";

export const registerSchema = z.object({
  nombreusuario: z
    .string()
    .nonempty("Por favor, ingresa tu nombre.")
    .refine((val) => isNaN(Number(val)), {
      message: "El nombre debe contener solo letras.",
    }),
  apellidousuario: z
    .string()
    .nonempty("Por favor, ingresa tu apellido.")
    .refine((val) => isNaN(Number(val)), {
      message: "El apellido debe contener solo letras.",
    }),
  correousuario: z
    .string()
    .nonempty("Por favor, ingresa tu correo electrónico.")
    .email("El correo electrónico no tiene un formato válido."),
  contrasenausuario: z
    .string()
    .nonempty("Por favor, ingresa tu contraseña.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  tituloprofesionaleducador: z
    .string()
    .nonempty("Por favor, ingresa tus estudios."),
  intereseseducador: z.string().nonempty("Por favor, ingresa tus intereses."),
  paiseducador: z.string().nonempty("Por favor, selecciona tu país."),
  edadeducador: z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null)
        return undefined; // Manejo de vacío
      const num = Number(value);
      return isNaN(num) ? undefined : num; // Evita NaN
    },
    z
      .number({
        required_error: "Por favor, ingresa tu edad.",
        invalid_type_error: "Parece que ingresaste un número no válido.",
      })
      .min(18, "La edad mínima permitida es 18 años.")
      .max(65, "La edad máxima permitida es 65 años.")
  ),
  institucioneducador: z
    .string()
    .nonempty("Por favor, selecciona la institución donde te desempeñas."),
  sexoeducador: z.string().nonempty("Por favor, selecciona tu sexo."),
  anosexperienciaeducador: z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null)
        return undefined; // Manejo de vacío
      const num = Number(value);
      return isNaN(num) ? undefined : num; // Evita NaN
    },
    z
      .number({
        required_error: "Por favor, ingresa tu edad.",
        invalid_type_error: "Parece que ingresaste un número no válido.",
      })
      .min(0, "Los años de experiencia deben ser positivos.")
  ),
});

export const loginSchema = z.object({
  correousuario: z
    .string()
    .nonempty("Por favor, ingresa tu correo electrónico.")
    .email("El correo electrónico no tiene un formato válido."),
  contrasenausuario: z
    .string()
    .nonempty("Por favor, ingresa tu contraseña.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});
