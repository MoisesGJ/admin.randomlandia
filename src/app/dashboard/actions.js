"use server";

import { getUserIdFromSession } from "@/app/_lib/session";
import { getUserFromDB } from "../_lib/mongo/adapter";

import { deleteSession } from "../_lib/session";

export async function logOut() {
  try {
    await deleteSession();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export async function getCurrentProfile() {
  const idUser = await getUserIdFromSession();

  const user = await getUserFromDB(idUser);


  return user;
}
