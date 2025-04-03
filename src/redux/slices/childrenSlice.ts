// src/redux/childrenSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Child } from "@/types/child";
import {
  fetchAllChildren,
  fetchChildById,
  createChild,
  updateChild,
  deleteChild,
} from "../thunks/childrenThunks";

interface ChildrenState {
  list: Child[];
  current: Child;
  loading: boolean;
  error: string | null;
}

const initialState: ChildrenState = {
  list: [],
  current: {
    id: "",
    firstName: "",
    parentalAccountId: "",
  },
  loading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setCurrentChild(state, action: PayloadAction<Child>) {
      state.current = action.payload;
    },
    clearCurrentChild(state) {
      state.current = {
        id: "",
        firstName: "",
        parentalAccountId: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllChildren
      .addCase(fetchAllChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllChildren.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchChildById
      .addCase(fetchChildById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchChildById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al cargar hijo/a";
      })

      // createChild
      .addCase(createChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChild.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al crear hijo/a";
      })

      // updateChild
      .addCase(updateChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChild.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al actualizar hijo/a";
      })

      // deleteChild
      .addCase(deleteChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChild.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentChild, clearCurrentChild } = childrenSlice.actions;
export default childrenSlice.reducer;
