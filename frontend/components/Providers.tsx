"use client";

import { AppProvider } from "@/context/AppProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
