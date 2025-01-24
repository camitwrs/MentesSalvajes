import { z } from "zod";

export const RegisterSchema = z.object({
  nombreusuario: z
    .string()
    .nonempty("El nombre es requerido.")
    .refine((val) => isNaN(Number(val)), {
      message: "El nombre no puede ser un número.",
    }),
  apellidousuario: z
    .string()
    .nonempty("El apellido es requerido.")
    .refine((val) => isNaN(Number(val)), {
      message: "El apellido no puede ser un número.",
    }),
  correousuario: z
    .string()
    .nonempty("El correo es requerido.")
    .email("Debe ser un correo válido."),
  contrasenausuario: z
    .string()
    .nonempty("La contraseña es requerida.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const loginSchema = z.object({
  correousuario: z
    .string()
    .email("El formato del correo es inválido.")
    .nonempty("El correo es obligatorio."),
  contrasenausuario: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .nonempty("La contraseña es obligatoria."),
});
