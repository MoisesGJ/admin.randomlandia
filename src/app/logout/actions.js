"use server";


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

