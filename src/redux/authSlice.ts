import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ExtendedAuthUser } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: ExtendedAuthUser | null;
  isAuthenticated: boolean;
  roles: string[];
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  roles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: ExtendedAuthUser;
        token: string;
        roles: string[];
      }>
    ) {
      console.log("🔐 setUser llamado con:", action.payload);

      if (!action.payload.token || action.payload.token.trim() === "") {
        console.warn("⚠️ setUser fue llamado sin token. Evitado.");
        return;
      }

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
