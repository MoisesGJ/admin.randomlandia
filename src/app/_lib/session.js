import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    expires: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    path: "/",
  },
};

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    error.name !== "JWSInvalid" && console.error(error);
  }
}

export async function createSession(userId) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ userId, expires });

  cookies().set(cookie.name, session, { ...cookie.options, expires });

  return { redirect: "/dashboard" };
}

export async function verifySession() {
  const sessionCookie = cookies().get(cookie.name)?.value;

  if (!sessionCookie) {
    redirect("/login");
  }

  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { userId: session.userId };
}

export async function deleteSession() {
  cookies().delete(cookie.name);

  return { redirect: "/login" };
}

export async function getUserIdFromSession() {
  try {
    const { userId } = await verifySession();
    return userId;
  } catch (error) {
    console.error("Error verifying session:", error);
    return false;
  }
}
