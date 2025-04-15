// redux/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ExtendedAuthUser, ValidRole } from "@/types/auth";

interface AuthState {
  user: ExtendedAuthUser | null;
  token: string;
  roles: ValidRole[];
  isAuthenticated: boolean;
  isLoading: boolean; // ✅ nuevo estado para indicar si está cargando sesión
}

const initialState: AuthState = {
  user: null,
  token: "",
  roles: [],
  isAuthenticated: false,
  isLoading: true, // inicia en true
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
        roles: ValidRole[];
      }>
    ) {
      const incomingUser = action.payload.user;

      state.user = action.payload.user;

      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      state.isLoading = false;

      console.log("🧩 Usuario seteado en Redux:", state.user);
    },
    logout(state) {
      state.user = null;
      state.token = "";
      state.roles = [];
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
