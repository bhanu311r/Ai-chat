"use client";

import { createContext, useContext } from "react";

export const DraftHistoryContext = createContext<string | null>(null);

export function useDraftHistoryTitle() {
  return useContext(DraftHistoryContext);
}
