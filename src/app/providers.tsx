"use client";

import React, { useEffect, ReactNode, PropsWithChildren } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/redux/store";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";

function ReduxWrapper({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAndSetSession());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ReduxWrapper>{children}</ReduxWrapper>
    </Provider>
  );
}
