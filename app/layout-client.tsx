"use client";

import { Provider } from "./provider";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </Provider>
  );
}
