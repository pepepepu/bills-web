import type { Supply, SupplyInput } from "../interfaces/finance";
import { apiRequest } from "./api";

export const listSupplies = (month?: string) =>
  apiRequest<Supply[]>("/supplies", { query: { month } });

export const createSupply = (data: SupplyInput) =>
  apiRequest<Supply>("/supplies", { method: "POST", body: data });

export const updateSupply = (id: string, data: Partial<SupplyInput>) =>
  apiRequest<Supply>(`/supplies/${id}`, { method: "PUT", body: data });

export const toggleSupply = (id: string, actualCost?: number) =>
  apiRequest<Supply>(`/supplies/${id}/toggle`, {
    method: "PATCH",
    body: actualCost !== undefined ? { actualCost } : {},
  });

export const deleteSupply = (id: string) =>
  apiRequest<{ message: string }>(`/supplies/${id}`, { method: "DELETE" });
