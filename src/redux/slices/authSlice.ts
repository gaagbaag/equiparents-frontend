import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ExtendedAuthUser, ValidRole } from "@/types/auth";

interface AuthState {
  user: ExtendedAuthUser | null;
  token: string;
  roles: ValidRole[];
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: "",
  roles: [],
  isAuthenticated: false,
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
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = "";
      state.roles = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
