import { serialize } from "cookie";
import { NextApiResponse } from "next";

const TOKEN_NAME = "auth_token";

function createCookie(name: string, data: string, options = {}) {
  return serialize(name, data, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...options,
  });
}

function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader("Set-Cookie", createCookie(TOKEN_NAME, token));
}

export { setTokenCookie };
