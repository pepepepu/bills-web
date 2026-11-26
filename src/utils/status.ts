import type { Debt, DebtStatus, Expense, ExpenseStatus } from "../interfaces/finance";

export const isExpensePaid = (e: Pick<Expense, "status">) =>
  e.status !== "pending";

export const isDebtPaid = (d: Pick<Debt, "status">) => d.status === "paid";

/** Dívida que ainda conta no mês (rolada saiu deste mês). */
export const isDebtActive = (d: Pick<Debt, "status">) =>
  d.status !== "rolled_over";

export const expenseStatusLabel: Record<ExpenseStatus, string> = {
  pending: "Pendente",
  paid_by_pool: "Pago",
  paid_by_member: "Pago por membro",
};

export const debtStatusLabel: Record<DebtStatus, string> = {
  open: "Em aberto",
  paid: "Pago",
  postponed: "Adiado",
  rolled_over: "Passou pro próximo mês",
};

export const debtStatusTone = (status: DebtStatus) =>
  status === "paid"
    ? "success"
    : status === "postponed"
      ? "warning"
      : status === "rolled_over"
        ? "neutral"
        : "danger";
