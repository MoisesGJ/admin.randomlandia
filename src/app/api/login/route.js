import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET_KEY = process.env.SECRET_KEY; // Debes definir una clave secreta en tus variables de entorno

const mockUser = {
  username: process.env.USER,
  password: process.env.PASSWORD,
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const username = formData.get("user");
    const password = formData.get("password");

    const errors = {};
    if (!username) errors.user = "El nombre de usuario es obligatorio.";
    if (!password) errors.password = "La contraseña es obligatoria.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (username !== mockUser.username || password !== mockUser.password) {
      return NextResponse.json(
        { errors: { general: "Nombre de usuario o contraseña incorrectos." } },
        { status: 401 }
      );
    }

    // Crear token de sesión
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    // Configurar cookies
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo usar cookies seguras en producción
        maxAge: 3600, // 1 hora
        path: "/",
      })
    );

    return NextResponse.json(
      { message: "Inicio de sesión exitoso." },
      { status: 200, headers }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { errors: { general: "Error interno del servidor." } },
      { status: 500 }
    );
  }
}
