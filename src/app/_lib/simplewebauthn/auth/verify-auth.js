import "server-only";

import { verifyAuthenticationResponse } from "@simplewebauthn/server";

export async function AuthVerifyRegister(body, currentOptions, passkey) {
  let verification;

  verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: currentOptions.challenge,
    expectedRPID: process.env.AUTHN_RPID,
    expectedOrigin: process.env.AUTHN_ORIGIN,
    authenticator: {
      credentialID: passkey.id,
      credentialPublicKey: passkey.publicKey,
      counter: passkey.counter,
      transports: passkey.transports,
    },
  });

  const { verified } = verification;

  return verified;
}
