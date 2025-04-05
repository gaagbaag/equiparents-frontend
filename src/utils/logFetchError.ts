export const logFetchError = (error: any, context: string) => {
  if (error instanceof Error) {
    console.error(`⚠️ Error en ${context}:`, error.message);
  } else {
    console.error(`⚠️ Error en ${context}:`, error);
  }

  // Agrega más detalles si es necesario
  if (navigator.onLine) {
    console.info("Conexión a internet activa");
  } else {
    console.warn("No hay conexión a internet");
  }
};
