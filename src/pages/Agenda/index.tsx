import { useEffect, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import {
  CalendarCheck,
  CalendarDots,
  CheckCircle,
  Clock,
  HandCoins,
  Receipt,
  Wallet,
} from "@phosphor-icons/react";
import {
  AppLayout,
  Amount,
  Badge,
  Card,
  CardTitle,
  EmptyState,
  ErrorBanner,
  Field,
  Loading,
  MoneyInput,
  Muted,
  Row,
  Stat,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useMonth } from "../../hooks/useMonth";
import { listDebts } from "../../services/debtServices";
import { listExpenses } from "../../services/expenseServices";
import { fadeUp } from "../../styles/animations";
import { squircleMask } from "../../styles/squircle";
import {
  formatBRL,
  parseMoney,
  splitInstallment,
  todayISODate,
  toNumber,
} from "../../utils/format";
import { isDebtActive, isDebtPaid, isExpensePaid } from "../../utils/status";

export interface AgendaEntry {
  id: string;
  kind: "expense" | "debt";
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
      kind: "expense" as const,
      title: e.title,
      amount: toNumber(e.amount),
      day: e.dueDate ? e.dueDate.slice(0, 10) : null,
      paid: isExpensePaid(e),
      postponed: false,
    })),
    ...debts.filter(isDebtActive).map((d) => ({
      id: d.id,
      kind: "debt" as const,
      title: splitInstallment(d.title).name,
      amount: toNumber(d.amount),
      day: d.dueDate ? d.dueDate.slice(0, 10) : null,
      paid: isDebtPaid(d),
      postponed: d.status === "postponed",
    })),
  ];
}

type DayStatus = "paid" | "late" | "postponed" | "today" | "upcoming" | "nodate";

/** Gradiente do "tile" da data e cor da linha de cada status. */
const palette: Record<
  DayStatus,
  { gradient: string; color: string; soft: string; label: string }
> = {
  paid: {
    gradient: "linear-gradient(145deg, #5BE07F 0%, #28B04E 100%)",
    color: "#28B04E",
    soft: "rgba(52, 199, 89, 0.1)",
    label: "Pago",
  },
  late: {
    gradient: "linear-gradient(145deg, #FF6B61 0%, #E5281D 100%)",
    color: "#E5281D",
    soft: "rgba(255, 59, 48, 0.09)",
    label: "Atrasado",
  },
  postponed: {
    gradient: "linear-gradient(145deg, #FFC24D 0%, #FF8A00 100%)",
    color: "#FF8A00",
    soft: "rgba(255, 149, 0, 0.1)",
    label: "Adiado",
  },
  today: {
    gradient: "linear-gradient(145deg, #FF6FB1 0%, #D9468E 100%)",
    color: "#F2559F",
    soft: "rgba(242, 85, 159, 0.1)",
    label: "Hoje",
  },
  upcoming: {
    gradient: "linear-gradient(145deg, #6E8BFF 0%, #5856D6 100%)",
    color: "#5856D6",
    soft: "rgba(88, 86, 214, 0.08)",
    label: "A pagar",
  },
  nodate: {
    gradient: "linear-gradient(145deg, #AEAEB2 0%, #8E8E93 100%)",
    color: "#8E8E93",
    soft: "rgba(118, 118, 128, 0.08)",
    label: "Sem data",
  },
};

const badgeTone = {
  paid: "success",
  late: "danger",
  postponed: "warning",
  today: "primary",
  upcoming: "indigo",
  nodate: "neutral",
} as const;

const Progress = styled.div`
  position: relative;
  height: 12px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.fill};
  overflow: hidden;
`;

const ProgressFill = styled.span<{ $pct: number }>`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $pct }) => $pct}%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #34c759 0%, #30b0c7 55%, #5856d6 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
  transition: width 0.8s ${({ theme }) => theme.motion.spring};
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.8rem;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  i {
    width: 9px;
    height: 9px;
    border-radius: 9999px;
  }
`;

const Timeline = styled.ol`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DayItem = styled.li<{ $status: DayStatus; $i: number }>`
  position: relative;
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 0.75rem;
  animation: ${fadeUp} 0.5s ${({ theme }) => theme.motion.spring} both;
  animation-delay: ${({ $i }) => Math.min($i, 12) * 40}ms;

  /* linha que liga os dias */
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 25px;
    top: 56px;
    bottom: -0.75rem;
    width: 2px;
    border-radius: 2px;
    background: ${({ $status }) => palette[$status].color};
    opacity: 0.22;
  }
`;

const DateTile = styled.div<{ $status: DayStatus }>`
  ${squircleMask}
  width: 52px;
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: ${({ $status }) => palette[$status].gradient};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  line-height: 1;

  strong {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  small {
    margin-top: 2px;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.9;
  }
`;

const DayBody = styled.div<{ $status: DayStatus }>`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.7rem 0.85rem;
  border-radius: 16px;
  background: ${({ $status }) => palette[$status].soft};
  border-left: 3px solid ${({ $status }) => palette[$status].color};
  ${({ $status }) =>
    $status === "paid" &&
    css`
      opacity: 0.75;
    `}
`;

const Entry = styled.div<{ $paid: boolean; $kind: AgendaEntry["kind"] }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  min-width: 0;

  .icon {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
    color: ${({ $kind, theme }) =>
      $kind === "expense" ? theme.colors.info : theme.colors.purple};
    background: ${({ $kind, theme }) =>
      $kind === "expense" ? theme.colors.infoLight : theme.colors.purpleLight};
  }

  .title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: ${({ $paid }) => ($paid ? "line-through" : "none")};
    color: ${({ theme }) => theme.colors.text.body};
  }

  .value {
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: nowrap;
  }
`;

const HAVE_KEY = "@Bills:agenda-have";

const weekday = (day: string) =>
  new Date(`${day}T12:00:00`)
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "");

const Agenda = () => {
  const theme = useTheme();
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

  const total = entries.reduce((acc, e) => acc + e.amount, 0);
  const toPay = entries
    .filter((e) => !e.paid)
    .reduce((acc, e) => acc + e.amount, 0);
  const paidValue = total - toPay;
  const pct = total > 0 ? Math.round((paidValue / total) * 100) : 0;
  const haveValue = parseMoney(have);
  const missing = toPay - haveValue;
  const today = todayISODate();

  const statusOf = (day: string, list: AgendaEntry[]): DayStatus => {
    if (list.every((e) => e.paid)) return "paid";
    if (day === "sem-data") return "nodate";
    if (list.some((e) => e.postponed && !e.paid)) return "postponed";
    if (day < today) return "late";
    if (day === today) return "today";
    return "upcoming";
  };

  return (
    <AppLayout title="Agenda">
      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
          <Stat>
            <small>
              <Clock weight="fill" color={theme.colors.indigo} /> Falta pagar
            </small>
            <strong>{formatBRL(toPay)}</strong>
          </Stat>
          <Stat $highlight>
            <small>
              <Wallet weight="fill" /> {missing > 0 ? "Vai faltar" : "Vai sobrar"}
            </small>
            <strong>{formatBRL(Math.abs(missing))}</strong>
          </Stat>
        </TotalsGrid>
      )}

      <Card>
        <CardTitle icon={<CheckCircle weight="fill" />} tone="success">
          Progresso do mês
        </CardTitle>
        <Row $justify="space-between">
          <Muted>
            Pago {formatBRL(paidValue)} de {formatBRL(total)}
          </Muted>
          <Badge $tone={pct === 100 ? "success" : "indigo"}>{pct}%</Badge>
        </Row>
        <Progress aria-label={`${pct}% pago`}>
          <ProgressFill $pct={pct} />
        </Progress>
        <Field>
          O que eu tenho agora
          <MoneyInput value={have} onChange={saveHave} />
        </Field>
      </Card>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Card>
        <CardTitle icon={<CalendarDots weight="fill" />} tone="indigo">
          Por dia
        </CardTitle>
        <Legend>
          {(["late", "today", "upcoming", "postponed", "paid"] as DayStatus[]).map(
            (s) => (
              <span key={s}>
                <i style={{ background: palette[s].color }} />
                {palette[s].label}
              </span>
            ),
          )}
        </Legend>
        {loading && !data ? (
          <Loading />
        ) : days.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck weight="duotone" />}
            tone="indigo"
            title="Nada para pagar neste mês"
          >
            Contas e dívidas com vencimento aparecem aqui.
          </EmptyState>
        ) : (
          <Timeline>
            {days.map((day, i) => {
              const list = groups.get(day) ?? [];
              const sum = list.reduce((acc, e) => acc + e.amount, 0);
              const status = statusOf(day, list);
              return (
                <DayItem key={day} $status={status} $i={i}>
                  <DateTile $status={status}>
                    {day === "sem-data" ? (
                      <small>Sem data</small>
                    ) : (
                      <>
                        <strong>{day.slice(8, 10)}</strong>
                        <small>{weekday(day)}</small>
                      </>
                    )}
                  </DateTile>
                  <DayBody $status={status}>
                    <Row $justify="space-between">
                      <Badge $tone={badgeTone[status]}>
                        {palette[status].label}
                      </Badge>
                      <Amount>{formatBRL(sum)}</Amount>
                    </Row>
                    {list.map((e) => (
                      <Entry key={e.id} $paid={e.paid} $kind={e.kind}>
                        <span className="icon">
                          {e.kind === "expense" ? (
                            <Receipt weight="fill" />
                          ) : (
                            <HandCoins weight="fill" />
                          )}
                        </span>
                        <span className="title">{e.title}</span>
                        <span className="value">{formatBRL(e.amount)}</span>
                      </Entry>
                    ))}
                  </DayBody>
                </DayItem>
              );
            })}
          </Timeline>
        )}
      </Card>
    </AppLayout>
  );
};

export default Agenda;
