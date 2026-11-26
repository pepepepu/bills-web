import type { HouseMember, SettlementReport } from "../interfaces/finance";
import { apiRequest } from "./api";

export const listMembers = () => apiRequest<HouseMember[]>("/members");

export const getSettlement = (month: string) =>
  apiRequest<SettlementReport>("/settlement", { query: { month } });

export const updateMe = (data: {
  name?: string;
  monthlyIncome?: number;
  pixKey?: string | null;
}) =>
  apiRequest<HouseMember & { houseId: string }>("/members/me", {
    method: "PUT",
    body: data,
  });
