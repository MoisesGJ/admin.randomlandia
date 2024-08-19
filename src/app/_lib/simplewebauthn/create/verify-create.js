import "server-only";

import { verifyRegistrationResponse } from "@simplewebauthn/server";

export async function VerifyCreate(body, currentOptions) {
  let verification;
  verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: currentOptions.challenge,
    expectedRPID: process.env.AUTHN_RPID,
    expectedOrigin: process.env.AUTHN_ORIGIN,
  });

  const { verified, registrationInfo } = verification;

  return {
    state: verified,
    passKey: { registrationInfo, currentOptions, body },
  };
}
