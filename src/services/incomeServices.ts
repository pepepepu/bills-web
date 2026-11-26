import type { Income, IncomeInput } from "../interfaces/finance";

/**
 * A API ainda não tem /incomes. Enquanto isso as entradas ficam no
 * localStorage, com a mesma assinatura assíncrona dos outros services:
 * quando o endpoint existir, basta trocar o corpo destas funções por
 * apiRequest("/incomes", ...).
 */
const KEY = "@Bills:incomes";

const readAll = (): Income[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const writeAll = (items: Income[]) =>
  localStorage.setItem(KEY, JSON.stringify(items));

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export async function listIncomes(month: string): Promise<Income[]> {
  return readAll().filter((i) => i.billingMonth === month);
}

export async function createIncome(data: IncomeInput): Promise<Income> {
  const item = { ...data, id: newId() };
  writeAll([...readAll(), item]);
  return item;
}

export async function updateIncome(
  id: string,
  data: Partial<IncomeInput>,
): Promise<Income> {
  let updated: Income | undefined;
  writeAll(
    readAll().map((i) => {
      if (i.id !== id) return i;
      updated = { ...i, ...data };
      return updated;
    }),
  );
  if (!updated) throw new Error("Entrada não encontrada.");
  return updated;
}

export async function deleteIncome(id: string): Promise<void> {
  writeAll(readAll().filter((i) => i.id !== id));
}
