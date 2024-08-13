import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST(request) {
  try {
    const response = NextResponse.json({
      message: "Cierre de sesión exitoso.",
    });
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: -1,
        path: "/",
      })
    );
    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
