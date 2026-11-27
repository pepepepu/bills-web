import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  ArrowRight,
  CalendarCheck,
  ChartPieSlice,
  Clock,
  Confetti,
  Copy,
  HandCoins,
  PiggyBank,
  Receipt,
  Repeat,
  ShoppingCart,
  SquaresFour,
  UserPlus,
} from "@phosphor-icons/react";
import type { Tone } from "../../components";
import { squircle } from "../../styles/squircle";
import {
  AppLayout,
  Amount,
  Badge,
  Card,
  CardTitle,
  EmptyState,
  IconTile,
  ErrorBanner,
  List,
  ListItem,
  Loading,
  Muted,
  PillButton,
  Row,
  Stat,
  TodayCard,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { useMonth } from "../../hooks/useMonth";
import { getSettlement } from "../../services/houseServices";
import { listIncomes } from "../../services/incomeServices";
import { formatBRL, formatDay, todayISODate } from "../../utils/format";
import { loadAgenda } from "../Agenda";
import { sumIncomes } from "../Incomes";

const statusText = {
  DEBTOR: { label: "Deve à casa", tone: "danger" },
  CREDITOR: { label: "A receber", tone: "success" },
  SETTLED: { label: "Em dia", tone: "neutral" },
} as const;

const Shortcuts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
`;

const Shortcut = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.75rem;
  ${squircle(16)}
  background: ${({ theme }) => theme.colors.glassStrong};
  border: 0.5px solid ${({ theme }) => theme.colors.glassEdge};
  color: ${({ theme }) => theme.colors.text.body};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: transform 0.25s ${({ theme }) => theme.motion.spring};

  &:active {
    transform: scale(0.96);
  }
`;

const shortcuts: { to: string; label: string; icon: React.ReactNode; tone: Tone }[] = [
  { to: "/entradas", label: "Entradas", icon: <ArrowCircleDown weight="fill" />, tone: "success" },
  { to: "/contas", label: "Contas", icon: <Receipt weight="fill" />, tone: "info" },
  { to: "/dividas", label: "Dívidas", icon: <HandCoins weight="fill" />, tone: "purple" },
  { to: "/compras", label: "Compras", icon: <ShoppingCart weight="fill" />, tone: "warning" },
  { to: "/assinaturas", label: "Assinaturas", icon: <Repeat weight="fill" />, tone: "teal" },
];

/** Tela de cada tipo de lançamento (para o card "Para hoje"). */
const kindPath = {
  expense: "/contas",
  debt: "/dividas",
  subscription: "/assinaturas",
} as const;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { month } = useMonth();

  const summary = useAsync(async () => {
    const [agenda, incomes] = await Promise.all([
      loadAgenda(month),
      listIncomes(month, true),
    ]);
    return { agenda, incomes: sumIncomes(incomes) };
  }, [month]);

  const settlement = useAsync(() => getSettlement(month), [month]);

  const agenda = summary.data?.agenda ?? [];
  const incomes = summary.data?.incomes ?? {
    gross: 0,
    net: 0,
    received: 0,
    extra: 0,
  };
  const outflow = agenda.reduce((acc, e) => acc + e.amount, 0);
  const toPay = agenda
    .filter((e) => !e.paid)
    .reduce((acc, e) => acc + e.amount, 0);
  const remaining = incomes.net - outflow;
  const today = todayISODate();
  const upcoming = agenda
    .filter((e) => !e.paid)
    .sort((a, b) => (a.day ?? "9999").localeCompare(b.day ?? "9999"))
    .slice(0, 5);
  const dueToday = agenda
    .filter((e) => !e.paid && e.day === today)
    .map((e) => ({
      id: e.id,
      kind: e.kind,
      title: e.title,
      amount: e.amount,
      onOpen: () => navigate(kindPath[e.kind]),
    }));

  return (
    <AppLayout
      title={`Olá, ${user?.name?.split(" ")[0] ?? ""}`}
      onRefresh={() => Promise.all([summary.reload(), settlement.reload()])}
    >
      {summary.error && <ErrorBanner>{summary.error}</ErrorBanner>}

      <TodayCard items={dueToday} />

      {summary.loading && !summary.data ? (
        <TotalsSkeleton count={4} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>
            <ArrowCircleDown weight="fill" /> Entradas (líquido)
          </small>
          <strong>{formatBRL(incomes.net)}</strong>
        </Stat>
        <Stat>
          <small>
            <ArrowCircleUp weight="fill" /> Saídas do mês
          </small>
          <strong>{formatBRL(outflow)}</strong>
        </Stat>
        <Stat $highlight>
          <small>
            <PiggyBank weight="fill" /> Restante
          </small>
          <strong>{formatBRL(remaining)}</strong>
        </Stat>
        <Stat>
          <small>
            <Clock weight="fill" /> Falta pagar
          </small>
          <strong>{formatBRL(toPay)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      <Card>
        <CardTitle icon={<SquaresFour weight="fill" />} tone="primary">
          Atalhos
        </CardTitle>
        <Shortcuts>
          {shortcuts.map((s) => (
            <Shortcut key={s.to} to={s.to}>
              <IconTile $tone={s.tone} $size={32}>
                {s.icon}
              </IconTile>
              {s.label}
            </Shortcut>
          ))}
        </Shortcuts>
      </Card>

      <Card>
        <CardTitle
          icon={<CalendarCheck weight="fill" />}
          tone="indigo"
          action={
            <Link to="/agenda">
              <PillButton as="span" $variant="ghost" $small>
                Agenda <ArrowRight weight="bold" />
              </PillButton>
            </Link>
          }
        >
          A pagar
        </CardTitle>
        {summary.loading && !summary.data ? (
          <Loading />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={<Confetti weight="duotone" />}
            tone="success"
            title="Tudo pago neste mês"
          />
        ) : (
          <List>
            {upcoming.map((e) => (
              <ListItem key={e.id}>
                <Row style={{ flex: 1, minWidth: 0 }}>
                  <Muted style={{ width: "3rem", flexShrink: 0 }}>
                    {e.day ? formatDay(e.day) : "-"}
                  </Muted>
                  <span>{e.title}</span>
                  {e.day && e.day < today && (
                    <Badge $tone="danger">Atrasado</Badge>
                  )}
                  {e.postponed && <Badge $tone="warning">Adiado</Badge>}
                </Row>
                <Amount>{formatBRL(e.amount)}</Amount>
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      <Card>
        <CardTitle icon={<ChartPieSlice weight="fill" />} tone="teal">
          Divisão da casa
        </CardTitle>
        <Muted>
          Contas da casa divididas pela renda de cada um (renda fixa + extras
          do mês), mais as dívidas pessoais.
        </Muted>
        {settlement.error ? (
          <ErrorBanner>{settlement.error}</ErrorBanner>
        ) : !settlement.data ? (
          <Loading />
        ) : (
          <List>
            {settlement.data.balances.map((b) => (
              <ListItem key={b.memberId}>
                <div style={{ flex: 1 }}>
                  <Row>
                    <strong>{b.name}</strong>
                    <Badge $tone={statusText[b.status].tone}>
                      {statusText[b.status].label}
                    </Badge>
                  </Row>
                  <Muted>
                    Renda {formatBRL(b.monthlyIncome)}
                    {b.extraIncome ? ` (${formatBRL(b.extraIncome)} extra)` : ""}
                    {" · "}
                    Parte {formatBRL(b.expectedShare)} (
                    {Math.round(b.incomeRatio * 100)}%) · pagou{" "}
                    {formatBRL(b.directPayments)} · dívidas{" "}
                    {formatBRL(b.debtsOwed)}
                  </Muted>
                </div>
                <Amount $tone={b.netBalance < 0 ? "danger" : "success"}>
                  {formatBRL(b.netBalance)}
                </Amount>
              </ListItem>
            ))}
          </List>
        )}
        {settlement.data?.housePixAccount.pixKey && (
          <Muted>
            Pix da casa: {settlement.data.housePixAccount.pixKey} (
            {settlement.data.housePixAccount.receiverName})
          </Muted>
        )}
      </Card>

      {user?.houseId && (
        <Card>
          <CardTitle icon={<UserPlus weight="fill" />} tone="info">
            Chamar alguém pra casa
          </CardTitle>
          <Muted>
            Na tela de cadastro, a pessoa escolhe "Entrar em Casa Existente" e
            cola este código.
          </Muted>
          <PillButton
            $variant="ghost"
            $full
            onClick={() => navigator.clipboard?.writeText(user.houseId)}
          >
            <Copy weight="bold" /> Copiar código da casa
          </PillButton>
        </Card>
      )}
    </AppLayout>
  );
};

export default Home;
