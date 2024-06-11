import { CandidateProps } from "@/@types";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface CandidatesContextProps {
    allCandidates: CandidateProps[];
    saveCandidates: (candidates: CandidateProps[]) => void;
}
interface CandidatesProviderProps {
  children: ReactNode;
}

export const CandidatesContext = createContext({} as CandidatesContextProps);

function CandidatesProvider({ children }: CandidatesProviderProps) {
  const [allCandidates, setAllCandidates] = useState<CandidateProps[]>([]);

  function saveCandidates(candidates: CandidateProps[]) {
    setAllCandidates(candidates);
  }

  useEffect(() => {console.log(allCandidates)}, [allCandidates])

  return (
    <CandidatesContext.Provider value={{ allCandidates, saveCandidates }}>
      {children}
    </CandidatesContext.Provider>
  )
}

function useCandidates() {
    const context = useContext(CandidatesContext);

    return context;
}

export { CandidatesProvider, useCandidates };
