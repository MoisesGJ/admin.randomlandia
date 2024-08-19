"use server";

import {
  getUserFromDB,
  saveNewPasskey,
  getUserPasskeys,
} from "@/app/_lib/mongo/adapter";

import { Register } from "@/app/_lib/simplewebauthn/create/options-create";
import { VerifyCreate } from "@/app/_lib/simplewebauthn/create/verify-create";

export async function CreateOptions(idUser) {
  const user = await getUserFromDB(idUser);

  const userPasskeys = await getUserPasskeys(idUser);

  const options = await Register(user, userPasskeys);
  return options;
}

export async function CreateVerify(registration, currOptions, idUser) {
  const verifyPass = await VerifyCreate(registration, currOptions);

  if (!verifyPass.state) return false;

  const { passKey } = verifyPass;

  createPassKey(
    passKey.registrationInfo,
    passKey.currentOptions,
    passKey.body,
    idUser
  );

  return true;
}

async function createPassKey(registrationInfo, currentOptions, body, idUser) {
  try {
    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;

    const newPasskey = {
      user: idUser,
      webAuthnUserID: currentOptions.user.id,
      id: credentialID,
      publicKey: credentialPublicKey,
      counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: body.response.transports,
    };

    const save = await saveNewPasskey(newPasskey);

    if (!save) return false;

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
}
