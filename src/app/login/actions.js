"use server";

import { createSession, createLink, validateLink } from "@/app/_lib/session";
import { z } from "zod";

import SendEmail from "@/app/_lib/resend/send-email";
import Template from "../_lib/resend/templates/auth.html";

import { getUserFromUserName } from "../_lib/mongo/adapter";
import { getUserPasskeys, getUserOnePasskey } from "@/app/_lib/mongo/adapter";

import { AuthRegister } from "@/app/_lib/simplewebauthn/auth/options-auth";
import { AuthVerifyRegister } from "@/app/_lib/simplewebauthn/auth/verify-auth";

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com\.mx|live\.com\.mx|googlemail\.com)$/;

const schema = z.object({
  email: z
    .string()
    .min(2, {
      message: "El correo debe tener al menos 2 caracteres.",
    })
    .regex(emailRegex, {
      message: "El correo debe ser un correo válido.",
    }),
});

async function validationInput(formData) {
  const validation = schema.safeParse({
    email: formData.get("email"),
  });

  if (!validation.success) {
    const errors = validation.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});

    return { success: false, errors };
  }

  const { email } = validation.data;
  const user = await getUserFromUserName(email);

  if (!user)
    return { success: false, errors: { global: "Credenciales inválidas" } };

  return { success: true, data: user };
}

export async function magicLink(formData) {
  const validate = await validationInput(formData);
  if (!validate.success) return validate;

  const user = validate.data;

  const link = await createLink({ id: user._id });

  const passSend = await SendEmail(
    [user.username],
    "¡Inicia sesión!",
    Template(link)
  );

  if (passSend)
    return { success: true, global: "¡Revisa tu correo para iniciar sesión!" };
  else {
    return { success: false, errors: { global: "Credenciales inválidas" } };
  }
}

export async function validateEmailKey(token) {
  try {
    const isValidLink = await validateLink(token);

    if (!isValidLink.success) {
      return { success: false, error: "Token inválido" };
    }

    const session = await createSession({ id: isValidLink.payload.id });

    console.log(session);

    if (!session) {
      return { success: false, error: "No se pudo crear la sesión" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en la validación del enlace:", error);
    return { success: false, error: "Error en el proceso de validación" };
  }
}

export async function AuthOptions(formData) {
  const validate = await validationInput(formData);
  if (!validate.success) return validate;

  const user = validate.data;

  const idUser = user._id;
  const userPasskeys = await getUserPasskeys(idUser);

  const options = await AuthRegister(userPasskeys);

  if (!options.state)
    return {
      success: false,
      errors: { global: "Error al recuperar opciones" },
    };

  return {
    success: true,
    options: options.options,
  };
}

export async function AuthVerify(currentOptions, prevPassKey) {
  const { id } = prevPassKey;

  const currentPassKey = await getUserOnePasskey(id);

  if (!currentPassKey)
    return {
      success: false,
      errors: { global: "No se tiene una key" },
    };

  const verifyPass = await AuthVerifyRegister(
    prevPassKey,
    currentOptions,
    currentPassKey
  );

  if (verifyPass) {
    const session = await createSession(currentPassKey.user);

    return { success: true, redirect: session.redirect };
  } else {
    return { success: false, errors: { global: "Credenciales inválidas" } };
  }
}
