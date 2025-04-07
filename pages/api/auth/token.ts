import { getAccessToken } from "@auth0/nextjs-auth0";
import { jwtDecode } from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";

type CustomClaims = {
  "https://equiparents.api/roles"?: string[];
  "https://equiparents.api/parentalAccountId"?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    console.log("Access Token:", accessToken);

    if (!accessToken) {
      return res.status(401).json({ error: "Token no disponible" });
    }

    if (process.env.NODE_ENV === "development") {
      try {
        const decoded = jwtDecode<CustomClaims>(accessToken);
        console.log("✅ Token decodificado:", decoded);
      } catch (err) {
        console.error("❌ No se pudo decodificar el token:", err);
      }
    }

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error("❌ Error al obtener accessToken:", err);
    return res.status(500).json({ error: "Error interno al obtener token" });
  }
}
