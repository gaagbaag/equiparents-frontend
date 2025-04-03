import { getAccessToken } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    if (!accessToken) {
      return res.status(401).json({ message: "Token no disponible" });
    }

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error("❌ Error al obtener accessToken:", err);
    return res.status(500).json({ message: "Error al obtener token" });
  }
}
