import "server-only";

import { generateRegistrationOptions } from "@simplewebauthn/server";

export async function Register(user, userPasskeys) {
  try {
    const options = await generateRegistrationOptions({
      rpName: process.env.AUTHN_RPNAME,
      rpID: process.env.AUTHN_RPID,
      userName: user.username,
      attestationType: "none",
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports,
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    return { state: true, options };
  } catch (error) {
    console.error("Error al generar opciones de registro:", error);

    return { state: false, error: "Error al generar opciones de registro" };
  }
}
