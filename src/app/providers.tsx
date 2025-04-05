// src/app/providers.tsx
"use client";

import React, { useEffect, ReactNode, PropsWithChildren } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/redux/store";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";

// 🔁 Encapsulamos la sincronización de sesión
function ReduxWrapper({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  return <>{children}</>;
}

// 🌍 Proveedor global de Redux + sesión
export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ReduxWrapper>{children}</ReduxWrapper>
    </Provider>
  );
}
