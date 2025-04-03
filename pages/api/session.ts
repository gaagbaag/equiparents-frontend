// pages/api/session.ts
import { getSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);

  if (!session?.user) {
    return res.status(200).json({ user: null });
  }

  const roles =
    session.accessToken && typeof session.accessToken === "string"
      ? JSON.parse(
          Buffer.from(session.accessToken.split(".")[1], "base64").toString()
        )["https://equiparents.api/roles"] || []
      : [];

  return res
    .status(200)
    .json({ user: session.user, token: session.accessToken, roles });
}
