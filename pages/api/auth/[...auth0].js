import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    return handleLogin(req, res, {
      authorizationParams: {
        prompt: "login", // fuerza re–autenticación
        // prompt: "select_account" // en Google, muestra selector de cuenta
        screen_hint: "signup", // sugiere UI de registro en Auth0
      },
    });
  },
});
