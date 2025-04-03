const optionalVars = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_AUTH0_DOMAIN"];

export function validateAuth0EnvVars() {
  const requiredVars = [
    "AUTH0_SECRET",
    "AUTH0_BASE_URL",
    "AUTH0_ISSUER_BASE_URL",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
  ];

  const missing = requiredVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`❌ Variables de entorno faltantes: ${missing.join(", ")}`);
  }

  return true;
}
