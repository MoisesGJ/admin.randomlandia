import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET_KEY = process.env.SECRET_KEY;

export async function GET(request) {
  try {
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
