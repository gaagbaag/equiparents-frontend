"use client";

import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useCheckSession } from "@/hooks/useCheckSession";

function ReduxWrapper({ children }: PropsWithChildren) {
  useCheckSession(); // 🧠 Hook que sincroniza sesión al cargar
  return <>{children}</>;
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ReduxWrapper>{children}</ReduxWrapper>
    </Provider>
  );
}
