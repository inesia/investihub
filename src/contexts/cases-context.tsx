"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CaseWithRelations } from "@/types";
import type { CreateCaseInput } from "@/lib/validations/case";
import { createCase as createCaseInStore, getAllCases } from "@/lib/case-store";

interface CasesContextValue {
  cases: CaseWithRelations[];
  isLoading: boolean;
  addCase: (input: CreateCaseInput) => CaseWithRelations;
  getCaseById: (id: string) => CaseWithRelations | undefined;
  refreshCases: () => void;
}

const CasesContext = createContext<CasesContextValue | null>(null);

export function CasesProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CaseWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCases = useCallback(() => {
    setCases(getAllCases());
  }, []);

  useEffect(() => {
    refreshCases();
    setIsLoading(false);
  }, [refreshCases]);

  const addCase = useCallback(
    (input: CreateCaseInput) => {
      const newCase = createCaseInStore(input);
      setCases(getAllCases());
      return newCase;
    },
    []
  );

  const getCaseById = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases]
  );

  return (
    <CasesContext.Provider
      value={{ cases, isLoading, addCase, getCaseById, refreshCases }}
    >
      {children}
    </CasesContext.Provider>
  );
}

export function useCases() {
  const ctx = useContext(CasesContext);
  if (!ctx) throw new Error("useCases must be used within CasesProvider");
  return ctx;
}
