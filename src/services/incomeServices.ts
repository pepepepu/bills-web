import type { Income, IncomeInput } from "../interfaces/finance";
import { apiRequest } from "./api";

/** Entradas da casa no mês. mine = só as do usuário logado. */
export const listIncomes = (month?: string, mine?: boolean) =>
  apiRequest<Income[]>("/incomes", {
    query: { month, mine: mine ? "true" : undefined },
  });

export const createIncome = (data: IncomeInput) =>
  apiRequest<Income>("/incomes", { method: "POST", body: data });

export const updateIncome = (id: string, data: Partial<IncomeInput>) =>
  apiRequest<Income>(`/incomes/${id}`, { method: "PUT", body: data });

export const toggleIncome = (id: string) =>
  apiRequest<Income>(`/incomes/${id}/toggle`, { method: "PATCH" });

export const deleteIncome = (id: string) =>
  apiRequest<{ message: string }>(`/incomes/${id}`, { method: "DELETE" });

/** Copia salário e vales do usuário de um mês para outro. */
export const copyIncomes = (fromMonth: string, toMonth: string) =>
  apiRequest<{ copied: number }>("/incomes/copy", {
    method: "POST",
    body: { fromMonth, toMonth },
  });
