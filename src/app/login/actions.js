"use server";

import { createSession } from "@/app/_lib/session";
import { redirect } from "next/dist/server/api-utils";
import { z } from "zod";

export async function login(formData) {
  // Define el esquema de validación con Zod
  const schema = z.object({
    user: z.string().min(2, {
      message: "El usuario debe tener al menos 2 caracteres.",
    }),
    password: z
      .string()
      .min(2, { message: "La contraseña debe tener al menos 2 caracteres." }),
  });

  // Validar los datos del formulario
  const validation = schema.safeParse({
    user: formData.get("user"),
    password: formData.get("password"),
  });

  if (!validation.success) {
    // Generar errores de validación
    const errors = validation.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});

    return { success: false, errors };
  }

  const { user, password } = validation.data;

  // Verificar las credenciales
  if (user === process.env.USER && password === process.env.PASSWORD) {
    // Crear una sesión si las credenciales son correctas
    const session = await createSession("admin");

    return { success: true, redirect: session.redirect };
  } else {
    // Manejar credenciales incorrectas
    return { success: false, errors: { global: "Credenciales inválidas" } };
  }
}
