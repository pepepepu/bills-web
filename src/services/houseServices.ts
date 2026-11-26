import type { HouseMember, SettlementReport } from "../interfaces/finance";
import { apiRequest } from "./api";

export const listMembers = () => apiRequest<HouseMember[]>("/members");

export const getSettlement = (month: string) =>
  apiRequest<SettlementReport>("/settlement", { query: { month } });
