import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
  try {
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({ user: null });
    }

    const user = session.user;
    const roles = user["https://equiparents.com/roles"] || [];
    const parentalAccountId =
      user["https://equiparents.com/parentalAccountId"] || null;

    return res.status(200).json({
      user: {
        sub: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
        firstName: user.given_name || null,
        lastName: user.family_name || null,
        parentalAccountId,
        role: roles[0] || null,
      },
      roles,
      accessToken: session.accessToken ?? "", // ✅ <—— AGREGA ESTO
    });
  } catch (err) {
    console.error("❌ Error en /api/session:", err);

    return res.status(500).json({ error: "Error al recuperar sesión" });
  }
}
