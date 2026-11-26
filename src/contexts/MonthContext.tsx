import React, { createContext, useState } from "react";
import { currentMonth } from "../utils/format";

interface MonthContextData {
  month: string;
  setMonth: (month: string) => void;
}

export const MonthContext = createContext<MonthContextData>(
  {} as MonthContextData,
);

export function MonthProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<string>(currentMonth);
  return (
    <MonthContext.Provider value={{ month, setMonth }}>
      {children}
    </MonthContext.Provider>
  );
}
