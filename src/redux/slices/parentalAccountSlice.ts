import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import fetchWithToken from "@/utils/fetchWithToken";

interface ParentalAccountState {
  children: any[];
  users: any[];
  finalized: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ParentalAccountState = {
  children: [],
  users: [],
  finalized: false,
  status: "idle",
};

export const fetchParentalAccount = createAsyncThunk<
  ParentalAccountState,
  void,
  { state: RootState }
>("parentalAccount/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`
    );

    if (!res.ok) {
      throw new Error("Error al obtener cuenta parental");
    }

    const data = await res.json();

    return {
      children: data.children || [],
      users: data.users || [],
      finalized: data.finalized || false,
      status: "succeeded",
    };
  } catch (err: any) {
    console.error("❌ Error en fetchParentalAccount:", err.message);
    return rejectWithValue(err.message);
  }
});

const parentalAccountSlice = createSlice({
  name: "parentalAccount",
  initialState,
  reducers: {
    resetParentalAccount: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentalAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParentalAccount.fulfilled, (state, action) => {
        state.children = action.payload.children;
        state.users = action.payload.users;
        state.finalized = action.payload.finalized;
        state.status = "succeeded";
      })
      .addCase(fetchParentalAccount.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { resetParentalAccount } = parentalAccountSlice.actions;
export default parentalAccountSlice.reducer;
