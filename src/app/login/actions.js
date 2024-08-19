"use server";

import { createSession } from "@/app/_lib/session";
import { z } from "zod";
import { getUserFromUserName } from "../_lib/mongo/adapter";

import { getUserPasskeys, getUserOnePasskey } from "@/app/_lib/mongo/adapter";
import { AuthRegister } from "@/app/_lib/simplewebauthn/auth/options-auth";
import { AuthVerifyRegister } from "@/app/_lib/simplewebauthn/auth/verify-auth";

export async function login(formData) {
  const schema = z.object({
    user: z.string().min(2, {
      message: "El usuario debe tener al menos 2 caracteres.",
    }),
    password: z
      .string()
      .min(2, { message: "La contraseña debe tener al menos 2 caracteres." }),
  });

  const validation = schema.safeParse({
    user: formData.get("user"),
    password: formData.get("password"),
  });

  if (!validation.success) {
    const errors = validation.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});

    return { success: false, errors };
  }

  const { user, password } = validation.data;

  const userExists = await getUserFromUserName(user);

  if (userExists && password === process.env.PASSWORD) {
    const session = await createSession(userExists._id);

    return { success: true, redirect: session.redirect };
  } else {
    return { success: false, errors: { global: "Credenciales inválidas" } };
  }
}

export async function AuthOptions(username) {
  const user = await getUserFromUserName(username);

  if (!user) return false;

  const idUser = user._id;
  const userPasskeys = await getUserPasskeys(idUser);

  const options = await AuthRegister(userPasskeys);

  return options;
}

export async function AuthVerify(currentOptions, prevPassKey) {
  const { id } = prevPassKey;

  const currentPassKey = await getUserOnePasskey(id);

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
