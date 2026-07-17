"use client";

import { createContext, useContext } from "react";

type CanvasActions = {
  centerPerson: (personId: string) => void;
  openProfile: (personId: string) => void;
  isPending: boolean;
};

const noop = () => {};

export const CanvasActionsContext = createContext<CanvasActions>({
  centerPerson: noop,
  openProfile: noop,
  isPending: false,
});

export function useCanvasActions() {
  return useContext(CanvasActionsContext);
}
