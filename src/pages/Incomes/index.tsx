import { useState } from "react";
import {
  ArrowCircleDown,
  Briefcase,
  Check,
  Copy,
  Coins,
  PencilSimple,
  Plus,
  Sparkle,
  Ticket,
  TrendUp,
  Wallet,
} from "@phosphor-icons/react";
import {
  AppLayout,
  Amount,
  Badge,
  Card,
  CardTitle,
  CheckButton,
  Chip,
  Chips,
  EmptyState,
  ErrorBanner,
  Field,
  Form,
  ItemMain,
  ItemTitle,
  List,
  Loading,
  MoneyInput,
  Muted,
  PillButton,
  Row,
  Segmented,
  SegmentButton,
  Sheet,
  Stat,
  SwipeRow,
  TextInput,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { useCreateParam } from "../../hooks/useCreateParam";
import { useMonth } from "../../hooks/useMonth";
import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import type { Income, IncomeKind } from "../../interfaces/finance";
import { updateMe } from "../../services/houseServices";
import {
  copyIncomes,
  createIncome,
  deleteIncome,
  listIncomes,
  toggleIncome,
  updateIncome,
} from "../../services/incomeServices";
import {
  formatBRL,
  parseMoney,
  shiftMonth,
  toNumber,
} from "../../utils/format";

export const sumIncomes = (items: Income[]) => {
  const gross = items.reduce((acc, i) => acc + toNumber(i.amount), 0);
  const cash = items.filter((i) => i.kind !== "voucher");
  const net = cash.reduce((acc, i) => acc + toNumber(i.amount), 0);
  const received = cash
    .filter((i) => i.received)
    .reduce((acc, i) => acc + toNumber(i.amount), 0);
  const extra = items
    .filter((i) => i.kind === "extra")
    .reduce((acc, i) => acc + toNumber(i.amount), 0);
  return { gross, net, received, extra };
};

export const incomeKindLabel: Record<IncomeKind, string> = {
  salary: "Salário",
  extra: "Extra",
  voucher: "Vale",
};

const kindIcon = {
  salary: <Briefcase weight="fill" />,
  extra: <Sparkle weight="fill" />,
  voucher: <Ticket weight="fill" />,
};

type Draft = {
  id?: string;
  title: string;
  amount: string;
  received: boolean;
  kind: IncomeKind;
};

const emptyDraft: Draft = {
  title: "",
  amount: "",
  received: false,
  kind: "salary",
};

type Scope = "mine" | "house";

const Incomes = () => {
  const { month } = useMonth();
  const { user, updateUser } = useAuth();
  const [scope, setScope] = useState<Scope>("mine");
  const { data, loading, error, reload } = useAsync(
    () => listIncomes(month, scope === "mine"),
    [month, scope],
  );
  const [draft, setDraft, closing] = useSheetState<Draft>();
  const [incomeDraft, setIncomeDraft, incomeClosing] = useSheetState<string>();
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const items = data ?? [];
  const totals = sumIncomes(items);
  const mineExtras = sumIncomes(
    items.filter((i) => i.memberId === user?.id),
  ).extra;
  const base = toNumber(user?.monthlyIncome);

  useCreateParam(() => setDraft({ ...emptyDraft }));

  const run = async (fn: () => Promise<unknown>, success?: string) => {
    try {
      await fn();
      await reload();
      if (success) toast.success(success);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado.");
      return false;
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const payload = {
      title: draft.title.trim(),
      amount: parseMoney(draft.amount),
      received: draft.received,
      kind: draft.kind,
      billingMonth: month,
    };
    if (payload.amount <= 0) {
      toast.error("Informe um valor maior que zero.");
      return;
    }
    setSaving(true);
    const ok = await run(
      () =>
        draft.id ? updateIncome(draft.id, payload) : createIncome(payload),
      draft.id ? "Entrada atualizada" : "Entrada adicionada",
    );
    setSaving(false);
    if (ok) setDraft(null);
  };

  const toggle = (item: Income) =>
    run(
      () => toggleIncome(item.id),
      item.received ? undefined : `${item.title} entrou`,
    );

  const openEdit = (item: Income) =>
    setDraft({
      id: item.id,
      title: item.title,
      amount: formatBRL(item.amount),
      received: item.received,
      kind: item.kind,
    });

  const copyPrevious = () =>
    run(async () => {
      const { copied } = await copyIncomes(shiftMonth(month, -1), month);
      toast.info(
        copied
          ? `${copied} entradas fixas copiadas`
          : "O mês anterior não tem salário nem vale seu",
      );
    });

  const saveBaseIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (incomeDraft === null) return;
    setSaving(true);
    try {
      const updated = await updateMe({
        monthlyIncome: parseMoney(incomeDraft),
      });
      updateUser({ monthlyIncome: toNumber(updated.monthlyIncome) });
      toast.success("Renda fixa atualizada");
      setIncomeDraft(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      title="Entradas"
      action={
        <PillButton $small onClick={() => setDraft({ ...emptyDraft })}>
          <Plus weight="bold" /> Nova
        </PillButton>
      }
    >
      <Chips>
        <Chip $active={scope === "mine"} onClick={() => setScope("mine")}>
          Minhas
        </Chip>
        <Chip $active={scope === "house"} onClick={() => setScope("house")}>
          Da casa toda
        </Chip>
      </Chips>

      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
          <Stat>
            <small>
              <Coins weight="fill" /> Total bruto
            </small>
            <strong>{formatBRL(totals.gross)}</strong>
          </Stat>
          <Stat $highlight>
            <small>
              <Wallet weight="fill" /> Total líquido
            </small>
            <strong>{formatBRL(totals.net)}</strong>
          </Stat>
        </TotalsGrid>
      )}

      <Card>
        <CardTitle
          icon={<TrendUp weight="bold" />}
          tone="teal"
          action={
            <PillButton
              $variant="ghost"
              $small
              onClick={() => setIncomeDraft(base ? formatBRL(base) : "")}
            >
              <PencilSimple weight="bold" /> Editar
            </PillButton>
          }
        >
          Minha contribuição
        </CardTitle>
        <Row $justify="space-between">
          <Muted>Renda fixa</Muted>
          <Amount>{formatBRL(base)}</Amount>
        </Row>
        <Row $justify="space-between">
          <Muted>Extras deste mês</Muted>
          <Amount $tone="success">+ {formatBRL(mineExtras)}</Amount>
        </Row>
        <Row $justify="space-between">
          <strong>Conta no rateio</strong>
          <Amount>{formatBRL(base + mineExtras)}</Amount>
        </Row>
        <Muted>
          Entradas do tipo "Extra" somam na sua renda e aumentam a sua parte
          na divisão das contas da casa deste mês.
        </Muted>
      </Card>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Card>
        <CardTitle icon={<ArrowCircleDown weight="fill" />} tone="success">
          {scope === "mine" ? "Minhas entradas" : "Entradas da casa"}
        </CardTitle>
        {items.length > 0 && (
          <Muted>
            Já entrou {formatBRL(totals.received)} de {formatBRL(totals.net)}.
            Arraste para o lado para editar ou excluir.
          </Muted>
        )}
        {loading && !data ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ArrowCircleDown weight="duotone" />}
            tone="success"
            title="Nenhuma entrada neste mês"
            action={
              scope === "mine" && (
                <PillButton $variant="outline" $small onClick={copyPrevious}>
                  <Copy weight="bold" /> Copiar do mês anterior
                </PillButton>
              )
            }
          >
            Lance salário, vales e valores extras que entrarem.
          </EmptyState>
        ) : (
          <List>
            {items.map((item) => {
              const mine = item.memberId === user?.id;
              return (
                <SwipeRow
                  key={item.id}
                  done={item.received}
                  disabled={!mine}
                  onEdit={() => openEdit(item)}
                  onDelete={() =>
                    run(() => deleteIncome(item.id), "Entrada excluída")
                  }
                >
                  <CheckButton
                    $checked={item.received}
                    disabled={!mine}
                    aria-label={
                      item.received
                        ? "Marcar como não entrou"
                        : "Marcar como entrou"
                    }
                    onClick={() => toggle(item)}
                  >
                    {item.received && <Check weight="bold" />}
                  </CheckButton>
                  <ItemMain
                    disabled={!mine}
                    onClick={() => mine && openEdit(item)}
                  >
                    <ItemTitle>{item.title}</ItemTitle>
                    <Row>
                      <Badge
                        $tone={
                          item.kind === "extra"
                            ? "teal"
                            : item.kind === "voucher"
                              ? "primary"
                              : "info"
                        }
                      >
                        {kindIcon[item.kind]}
                        {incomeKindLabel[item.kind]}
                      </Badge>
                      {item.received ? (
                        <Badge $tone="success">Entrou</Badge>
                      ) : (
                        <Badge>Aguardando</Badge>
                      )}
                      {scope === "house" && item.member && (
                        <Muted>{item.member.name}</Muted>
                      )}
                    </Row>
                  </ItemMain>
                  <Amount $tone="success">{formatBRL(item.amount)}</Amount>
                </SwipeRow>
              );
            })}
          </List>
        )}
      </Card>

      {draft && (
        <Sheet
          title={draft.id ? "Editar entrada" : "Nova entrada"}
          onClose={() => setDraft(null)}
          closing={closing}
        >
          <Form onSubmit={save} disabled={saving}>
            <Field>
              Descrição
              <TextInput
                required
                minLength={2}
                placeholder="Ex: Salário, Freela, Venda"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field>
              Valor
              <MoneyInput
                required
                value={draft.amount}
                onChange={(amount) => setDraft({ ...draft, amount })}
              />
            </Field>
            <Field as="div">
              Tipo
              <Segmented>
                {(Object.keys(incomeKindLabel) as IncomeKind[]).map((k) => (
                  <SegmentButton
                    key={k}
                    type="button"
                    $active={draft.kind === k}
                    onClick={() => setDraft({ ...draft, kind: k })}
                  >
                    {kindIcon[k]}
                    {incomeKindLabel[k]}
                  </SegmentButton>
                ))}
              </Segmented>
              <Muted>
                {draft.kind === "extra"
                  ? "Soma na sua renda e na sua contribuição da casa deste mês."
                  : draft.kind === "voucher"
                    ? "Entra no bruto, mas fica fora do líquido."
                    : "Seu salário fixo. A renda fixa do rateio fica no seu perfil."}
              </Muted>
            </Field>
            <Field as="div">
              Entrou?
              <Segmented>
                <SegmentButton
                  type="button"
                  $active={!draft.received}
                  onClick={() => setDraft({ ...draft, received: false })}
                >
                  Ainda não
                </SegmentButton>
                <SegmentButton
                  type="button"
                  $active={draft.received}
                  onClick={() => setDraft({ ...draft, received: true })}
                >
                  Sim
                </SegmentButton>
              </Segmented>
            </Field>
            <PillButton type="submit" $full disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </PillButton>
          </Form>
        </Sheet>
      )}

      {incomeDraft !== null && (
        <Sheet
          title="Renda fixa mensal"
          onClose={() => setIncomeDraft(null)}
          closing={incomeClosing}
        >
          <Form onSubmit={saveBaseIncome} disabled={saving}>
            <Field>
              Quanto você recebe por mês
              <MoneyInput
                required
                value={incomeDraft}
                onChange={(v) => setIncomeDraft(v)}
              />
            </Field>
            <Muted>
              Valores variáveis você lança como entrada "Extra" em cada mês.
            </Muted>
            <PillButton type="submit" $full disabled={saving}>
              {saving ? "Salvando..." : "Salvar renda"}
            </PillButton>
          </Form>
        </Sheet>
      )}
    </AppLayout>
  );
};

export default Incomes;
