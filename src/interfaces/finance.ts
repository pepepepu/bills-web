export type ExpenseFrequency = "monthly" | "weekly" | "daily";
export type ExpenseStatus = "pending" | "paid_by_pool" | "paid_by_member";

export interface MemberRef {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  houseId: string;
  title: string;
  amount: number | string;
  frequency: ExpenseFrequency;
  dueDate: string | null;
  isShared: boolean;
  paidByMemberId: string | null;
  paidByMember?: MemberRef | null;
  status: ExpenseStatus;
  billingMonth: string;
  createdAt?: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  frequency: ExpenseFrequency;
  dueDate?: string | null;
  isShared?: boolean;
  paidByMemberId?: string | null;
  status?: ExpenseStatus;
  billingMonth: string;
}

export type DebtType = "individual" | "family";
export type DebtStatus = "open" | "paid" | "postponed" | "rolled_over";

export interface Debt {
  id: string;
  houseId: string;
  debtorMemberId: string | null;
  debtorMember?: MemberRef | null;
  title: string;
  amount: number | string;
  type: DebtType;
  status: DebtStatus;
  targetMonth: string;
  dueDate: string | null;
  createdAt?: string;
}

export interface DebtInput {
  debtorMemberId?: string | null;
  title: string;
  amount: number;
  type: DebtType;
  status?: DebtStatus;
  targetMonth: string;
  dueDate?: string | null;
}

export interface Supply {
  id: string;
  houseId: string;
  itemName: string;
  category: string;
  estimatedCost: number | string;
  actualCost: number | string;
  isPurchased: boolean;
  billingMonth: string;
}

export interface SupplyInput {
  itemName: string;
  category: string;
  estimatedCost?: number;
  actualCost?: number;
  isPurchased?: boolean;
  billingMonth: string;
}

export interface MemberBalance {
  memberId: string;
  name: string;
  /** Renda usada no rateio (fixa + extras do mês). */
  monthlyIncome: number;
  baseIncome?: number;
  extraIncome?: number;
  incomeRatio: number;
  expectedShare: number;
  directPayments: number;
  debtsOwed: number;
  netBalance: number;
  status: "DEBTOR" | "CREDITOR" | "SETTLED";
}

export interface SettlementReport {
  houseName: string;
  billingMonth: string;
  housePixAccount: { receiverName: string; pixKey: string | null };
  totalHouseIncome: number;
  totalExpenses: number;
  totalIndividualDebts: number;
  balances: MemberBalance[];
}

export interface HouseMember {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number | string;
  pixKey?: string | null;
  role: "admin" | "resident";
}

/**
 * Entradas do mês (salário, extras, vales).
 * - salary: salário fixo
 * - extra: valor variável que soma na renda da pessoa no rateio da casa
 * - voucher: vale/benefício (entra no bruto, não no líquido)
 */
export type IncomeKind = "salary" | "extra" | "voucher";

export interface Income {
  id: string;
  houseId: string;
  memberId: string;
  member?: MemberRef | null;
  title: string;
  amount: number | string;
  kind: IncomeKind;
  received: boolean;
  billingMonth: string;
  createdAt?: string;
}

export interface IncomeInput {
  title: string;
  amount: number;
  kind: IncomeKind;
  received?: boolean;
  billingMonth: string;
}
