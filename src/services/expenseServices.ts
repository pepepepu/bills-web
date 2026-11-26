import type { Expense, ExpenseInput } from "../interfaces/finance";
import { apiRequest } from "./api";

export const listExpenses = (month?: string, frequency?: string) =>
  apiRequest<Expense[]>("/expenses", { query: { month, frequency } });

export const createExpense = (data: ExpenseInput) =>
  apiRequest<Expense>("/expenses", { method: "POST", body: data });

export const updateExpense = (id: string, data: Partial<ExpenseInput>) =>
  apiRequest<Expense>(`/expenses/${id}`, { method: "PUT", body: data });

export const deleteExpense = (id: string) =>
  apiRequest<{ message: string }>(`/expenses/${id}`, { method: "DELETE" });
