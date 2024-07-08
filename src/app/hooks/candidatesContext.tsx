"use client";

import { CandidatesContextProps, CandidatesProps } from "@/@types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CandidatesProviderProps {
  children: ReactNode;
}

export const CandidatesContext = createContext({} as CandidatesContextProps);

function CandidatesProvider({ children }: CandidatesProviderProps) {
  const [candidates, setCandidates] = useState<CandidatesProps[]>([]);

  function saveCandidates(newCandidates: any[]) {
    setCandidates(newCandidates);
  }

  useEffect(() => console.log(candidates), [candidates]);

  return (
    <CandidatesContext.Provider value={{ candidates, saveCandidates }}>
      {children}
    </CandidatesContext.Provider>
  );
}

function useCandidates() {
  const context = useContext(CandidatesContext);

  return context;
}

export { CandidatesProvider, useCandidates };