import "server-only";

import { generateAuthenticationOptions } from "@simplewebauthn/server";

export async function AuthRegister(userPasskeys) {
  try {
    const options = await generateAuthenticationOptions({
      rpID: process.env.AUTHN_RPID,
      allowCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports,
      })),
    });

    return { state: true, options };
  } catch (error) {
    console.error("Error al generar opciones de auth:", error);

    return { state: false, error: "Error al generar opciones de auth" };
  }
}
