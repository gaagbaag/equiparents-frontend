import { prisma } from "../config/database.js";

/**
 * Registra una entrada en el historial
 */
export const createHistoryEntry = async ({
  userId,
  parentalAccountId = null,
  type = "evento",
  category = "registro",
  summary = "",
  ip = null,
  userAgent = null,
}) => {
  try {
    await prisma.history.create({
      data: {
        userId,
        parentalAccountId,
        type,
        category,
        summary,
        ip,
        userAgent,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Error al registrar historial:", error);
  }
};
