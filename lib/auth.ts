import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export interface JWTPayload {
  id: string;
  email: string | null;
  displayName: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_MAX_AGE });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("access_token")?.value;
    const bearerToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const token = cookieToken ?? bearerToken;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuthUser(req: NextRequest): Promise<JWTPayload> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new Response(JSON.stringify({ success: false, message: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
