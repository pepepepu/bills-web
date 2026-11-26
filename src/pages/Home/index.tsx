import { Link } from "react-router-dom";
import { PiArrowRightBold, PiCopyBold } from "react-icons/pi";
import {
  AppLayout,
  Amount,
  Badge,
  Card,
  EmptyState,
  ErrorBanner,
  List,
  ListItem,
  ListSkeleton,
  Muted,
  PillButton,
  Row,
  SectionTitle,
  Stat,
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

const Home = () => {
  const { user } = useAuth();
  const { month } = useMonth();

  const summary = useAsync(async () => {
    const [agenda, incomes] = await Promise.all([
      loadAgenda(month),
      listIncomes(month),
    ]);
    return { agenda, incomes: sumIncomes(incomes) };
  }, [month]);

  const settlement = useAsync(() => getSettlement(month), [month]);

  const agenda = summary.data?.agenda ?? [];
  const incomes = summary.data?.incomes ?? { gross: 0, net: 0, received: 0 };
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

  return (
    <AppLayout title={`Olá, ${user?.name?.split(" ")[0] ?? ""}`}>
      {summary.error && <ErrorBanner>{summary.error}</ErrorBanner>}

      {summary.loading && !summary.data ? (
        <TotalsSkeleton count={4} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>Entradas (líquido)</small>
          <strong>{formatBRL(incomes.net)}</strong>
        </Stat>
        <Stat>
          <small>Saídas do mês</small>
          <strong>{formatBRL(outflow)}</strong>
        </Stat>
        <Stat $highlight>
          <small>Restante</small>
          <strong>{formatBRL(remaining)}</strong>
        </Stat>
        <Stat>
          <small>Falta pagar</small>
          <strong>{formatBRL(toPay)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      <Card>
        <Row $justify="space-between">
          <SectionTitle>A pagar</SectionTitle>
          <Link to="/agenda">
            <PillButton as="span" $variant="ghost" $small>
              Agenda <PiArrowRightBold />
            </PillButton>
          </Link>
        </Row>
        {summary.loading && !summary.data ? (
          <ListSkeleton rows={3} />
        ) : upcoming.length === 0 ? (
          <EmptyState>Tudo pago neste mês.</EmptyState>
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
        <SectionTitle>Divisão da casa</SectionTitle>
        <Muted>
          Contas da casa divididas pela renda de cada um, mais as dívidas
          pessoais.
        </Muted>
        {settlement.error ? (
          <ErrorBanner>{settlement.error}</ErrorBanner>
        ) : !settlement.data ? (
          <ListSkeleton rows={2} />
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
          <SectionTitle>Chamar alguém pra casa</SectionTitle>
          <Muted>
            Na tela de cadastro, a pessoa escolhe "Entrar em Casa Existente" e
            cola este código.
          </Muted>
          <PillButton
            $variant="ghost"
            $full
            onClick={() => navigator.clipboard?.writeText(user.houseId)}
          >
            <PiCopyBold /> Copiar código da casa
          </PillButton>
        </Card>
      )}
    </AppLayout>
  );
};

export default Home;
