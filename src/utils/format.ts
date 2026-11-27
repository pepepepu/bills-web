const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const toNumber = (value: number | string | null | undefined) =>
  Number(value ?? 0) || 0;

export const formatBRL = (value: number | string | null | undefined) =>
  toNumber(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

/** Converte "R$ 1.234,56" (máscara money do Input) em 1234.56 */
export const parseMoney = (masked: string) => {
  const digits = masked.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
};

/** "2026-11" */
export const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const shiftMonth = (month: string, delta: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const monthLabel = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

/** Converte o valor de <input type="date"> em ISO aceito pela API. */
export const dateInputToISO = (value: string) =>
  value ? `${value}T12:00:00.000Z` : null;

/** Converte ISO da API para o valor de <input type="date">. */
export const isoToDateInput = (iso: string | null | undefined) =>
  iso ? iso.slice(0, 10) : "";

/** "25/11" */
export const formatDay = (iso: string | null | undefined) => {
  if (!iso) return "";
  const [, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}`;
};

export const todayISODate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/**
 * Parcelas antigas: antes a API não tinha campo próprio e o número ficava no
 * título ("Parcela Ana Karla [2/4]"). Hoje vem em installmentNumber/Total;
 * use debtInstallment() que entende os dois jeitos.
 */
const INSTALLMENT_RE = /\s*\[(\d+)\/(\d+)\]/;

export const splitInstallment = (title: string) => {
  const match = title.match(INSTALLMENT_RE);
  if (!match) return { name: title, current: null, total: null };
  return {
    name: title.replace(INSTALLMENT_RE, "").trim(),
    current: Number(match[1]),
    total: Number(match[2]),
  };
};

export const joinInstallment = (
  name: string,
  current?: number | null,
  total?: number | null,
) => (current && total ? `${name.trim()} [${current}/${total}]` : name.trim());

/** Parcela de uma dívida: campos da API ou, em dívidas antigas, o título. */
export const debtInstallment = (d: {
  title: string;
  installmentNumber?: number | null;
  installmentTotal?: number | null;
}) => {
  if (d.installmentNumber && d.installmentTotal)
    return {
      name: d.title,
      current: d.installmentNumber,
      total: d.installmentTotal,
      legacy: false,
    };
  return { ...splitInstallment(d.title), legacy: true };
};

/** "2026-11" -> "Nov/26" */
export const shortMonthLabel = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1].slice(0, 3)}/${String(y).slice(2)}`;
};
