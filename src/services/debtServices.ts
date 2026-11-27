import type { Debt, DebtInput, DebtType } from "../interfaces/finance";
import { apiRequest } from "./api";

export const listDebts = (month?: string, type?: DebtType) =>
  apiRequest<Debt[]>("/debts", { query: { month, type } });

export const createDebt = (data: DebtInput) =>
  apiRequest<Debt>("/debts", { method: "POST", body: data });

export const updateDebt = (id: string, data: Partial<DebtInput>) =>
  apiRequest<Debt>(`/debts/${id}`, { method: "PUT", body: data });

export const postponeDebt = (id: string, newDueDate: string) =>
  apiRequest<Debt>(`/debts/${id}/postpone`, {
    method: "PATCH",
    body: { newDueDate },
  });

export const rolloverDebt = (id: string, nextMonth: string) =>
  apiRequest<{ originalDebt: Debt; newDebt: Debt }>(`/debts/${id}/rollover`, {
    method: "PATCH",
    body: { nextMonth },
  });

/** following: numa dívida parcelada, exclui também as parcelas seguintes. */
export const deleteDebt = (id: string, scope?: "following") =>
  apiRequest<{ message: string }>(`/debts/${id}`, {
    method: "DELETE",
    query: { scope },
  });
