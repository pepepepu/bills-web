import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  AppLayout,
  Amount,
  Badge,
  Card,
  EmptyState,
  ErrorBanner,
  ListSkeleton,
  Field,
  MoneyInput,
  Muted,
  Row,
  SectionTitle,
  Stat,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useMonth } from "../../hooks/useMonth";
import { listDebts } from "../../services/debtServices";
import { listExpenses } from "../../services/expenseServices";
import {
  formatBRL,
  formatDay,
  parseMoney,
  splitInstallment,
  todayISODate,
  toNumber,
} from "../../utils/format";
import { isDebtActive, isDebtPaid, isExpensePaid } from "../../utils/status";

export interface AgendaEntry {
  id: string;
  title: string;
  amount: number;
  day: string | null; // "2026-11-10"
  paid: boolean;
  postponed: boolean;
}

/** Junta contas e dívidas do mês num formato só, para agrupar por dia. */
export async function loadAgenda(month: string): Promise<AgendaEntry[]> {
  const [expenses, debts] = await Promise.all([
    listExpenses(month),
    listDebts(month),
  ]);
  return [
    ...expenses.map((e) => ({
      id: e.id,
      title: e.title,
      amount: toNumber(e.amount),
      day: e.dueDate ? e.dueDate.slice(0, 10) : null,
      paid: isExpensePaid(e),
      postponed: false,
    })),
    ...debts.filter(isDebtActive).map((d) => ({
      id: d.id,
      title: splitInstallment(d.title).name,
      amount: toNumber(d.amount),
      day: d.dueDate ? d.dueDate.slice(0, 10) : null,
      paid: isDebtPaid(d),
      postponed: d.status === "postponed",
    })),
  ];
}

const DayRow = styled.div<{ $today?: boolean }>`
  display: grid;
  grid-template-columns: 3.2rem 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.85rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  .day {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme, $today }) =>
      $today ? theme.colors.primary : theme.colors.text.body};
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 0;
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
  }
`;

const HAVE_KEY = "@Bills:agenda-have";

const Agenda = () => {
  const { month } = useMonth();
  const { data, loading, error } = useAsync(() => loadAgenda(month), [month]);
  const [have, setHave] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(HAVE_KEY) || "{}");
    setHave(saved[month] ? formatBRL(saved[month]) : "");
  }, [month]);

  const saveHave = (masked: string) => {
    setHave(masked);
    const saved = JSON.parse(localStorage.getItem(HAVE_KEY) || "{}");
    saved[month] = parseMoney(masked);
    localStorage.setItem(HAVE_KEY, JSON.stringify(saved));
  };

  const entries = data ?? [];
  const groups = new Map<string, AgendaEntry[]>();
  entries.forEach((e) => {
    const key = e.day ?? "sem-data";
    groups.set(key, [...(groups.get(key) ?? []), e]);
  });
  const days = [...groups.keys()].sort((a, b) =>
    a === "sem-data" ? 1 : b === "sem-data" ? -1 : a.localeCompare(b),
  );

  const toPay = entries
    .filter((e) => !e.paid)
    .reduce((acc, e) => acc + e.amount, 0);
  const haveValue = parseMoney(have);
  const missing = toPay - haveValue;
  const today = todayISODate();

  return (
    <AppLayout title="Agenda de pagamentos">
      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>Valor total a pagar</small>
          <strong>{formatBRL(toPay)}</strong>
        </Stat>
        <Stat $highlight>
          <small>{missing > 0 ? "Falta" : "Sobra"}</small>
          <strong>{formatBRL(Math.abs(missing))}</strong>
        </Stat>
      </TotalsGrid>
      )}

      <Field>
        O que eu tenho agora
        <MoneyInput value={have} onChange={saveHave} />
      </Field>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Card>
        <SectionTitle>Por dia</SectionTitle>
        {loading && !data ? (
          <ListSkeleton rows={4} />
        ) : days.length === 0 ? (
          <EmptyState>Nada para pagar neste mês.</EmptyState>
        ) : (
          days.map((day) => {
            const list = groups.get(day) ?? [];
            const sum = list.reduce((acc, e) => acc + e.amount, 0);
            const allPaid = list.every((e) => e.paid);
            const anyPostponed = list.some((e) => e.postponed && !e.paid);
            const late = !allPaid && day !== "sem-data" && day < today;
            return (
              <DayRow key={day} $today={day === today}>
                <span className="day">
                  {day === "sem-data" ? "Sem data" : formatDay(day)}
                </span>
                <div className="details">
                  {list.map((e) => (
                    <Muted
                      key={e.id}
                      style={{
                        textDecoration: e.paid ? "line-through" : "none",
                      }}
                    >
                      {e.title} · {formatBRL(e.amount)}
                    </Muted>
                  ))}
                </div>
                <div className="right">
                  <Amount>{formatBRL(sum)}</Amount>
                  <Row>
                    {allPaid ? (
                      <Badge $tone="success">Pago</Badge>
                    ) : anyPostponed ? (
                      <Badge $tone="warning">Adiado</Badge>
                    ) : late ? (
                      <Badge $tone="danger">Atrasado</Badge>
                    ) : (
                      <Badge>A pagar</Badge>
                    )}
                  </Row>
                </div>
              </DayRow>
            );
          })
        )}
      </Card>
    </AppLayout>
  );
};

export default Agenda;
