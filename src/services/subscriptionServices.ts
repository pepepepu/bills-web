import type {
  MonthSubscription,
  Subscription,
  SubscriptionInput,
} from "../interfaces/finance";
import { apiRequest } from "./api";

/** Assinaturas que cobram no mês, com vencimento, parte por pessoa e se pagou. */
export const listSubscriptions = (month: string) =>
  apiRequest<MonthSubscription[]>("/subscriptions", { query: { month } });

export const createSubscription = (data: SubscriptionInput) =>
  apiRequest<Subscription>("/subscriptions", { method: "POST", body: data });

export const updateSubscription = (
  id: string,
  data: Partial<SubscriptionInput>,
) =>
  apiRequest<Subscription>(`/subscriptions/${id}`, {
    method: "PUT",
    body: data,
  });

export const toggleSubscription = (id: string, month: string) =>
  apiRequest<{ id: string; billingMonth: string; paid: boolean }>(
    `/subscriptions/${id}/toggle`,
    { method: "PATCH", body: { month } },
  );

/**
 * Com fromMonth: deixa de cobrar a partir desse mês (os anteriores ficam).
 * Sem: apaga de vez.
 */
export const deleteSubscription = (id: string, fromMonth?: string) =>
  apiRequest<{ message: string }>(`/subscriptions/${id}`, {
    method: "DELETE",
    query: { month: fromMonth },
  });
