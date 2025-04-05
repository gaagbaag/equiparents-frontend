// pages/api/session.ts
import { getSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

// Función auxiliar segura para decodificar JWT sin lanzar errores
function decodeJwt(token: string): any {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json);
  } catch (err) {
    console.error("❌ Error al decodificar el token:", err);
    return {};
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession(req, res);

    if (!session?.user || !session.accessToken) {
      return res.status(200).json({ user: null });
    }

    const decoded = decodeJwt(session.accessToken);
    const roles = decoded["https://equiparents.api/roles"] || [];

    return res.status(200).json({
      user: session.user,
      accessToken: session.accessToken, // Renombrado para consistencia con frontend
      roles,
    });
  } catch (err) {
    console.error("❌ Error al obtener sesión:", err);
    return res.status(500).json({ message: "Error al obtener sesión" });
  }
}
