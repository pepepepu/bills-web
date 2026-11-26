import { useState } from "react";
import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import {
  Check,
  Copy,
  Funnel,
  Plus,
  Receipt,
  Clock,
} from "@phosphor-icons/react";
import { useCreateParam } from "../../hooks/useCreateParam";
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
  Select,
  Sheet,
  Stat,
  SwipeRow,
  TextInput,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { useMembers } from "../../hooks/useMembers";
import { useMonth } from "../../hooks/useMonth";
import type {
  Expense,
  ExpenseFrequency,
  ExpenseStatus,
} from "../../interfaces/finance";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "../../services/expenseServices";
import {
  dateInputToISO,
  formatBRL,
  formatDay,
  isoToDateInput,
  parseMoney,
  shiftMonth,
  toNumber,
} from "../../utils/format";
import { expenseStatusLabel, isExpensePaid } from "../../utils/status";

type Filter = "all" | "pending" | "paid";

type Draft = {
  id?: string;
  title: string;
  amount: string;
  dueDate: string;
  frequency: ExpenseFrequency;
  isShared: boolean;
  status: ExpenseStatus;
  paidByMemberId: string;
};

const emptyDraft: Draft = {
  title: "",
  amount: "",
  dueDate: "",
  frequency: "monthly",
  isShared: true,
  status: "pending",
  paidByMemberId: "",
};

const byDueDate = (a: Expense, b: Expense) =>
  (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");

/** Mesmo dia, um mês depois (para copiar contas fixas). */
const nextMonthISO = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
};

const Bills = () => {
  const { month } = useMonth();
  const { user } = useAuth();
  const members = useMembers();
  const { data, loading, error, reload } = useAsync(
    () => listExpenses(month),
    [month],
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft, closing] = useSheetState<Draft>();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const items = [...(data ?? [])].sort(byDueDate);
  const visible = items.filter((e) =>
    filter === "all"
      ? true
      : filter === "paid"
        ? isExpensePaid(e)
        : !isExpensePaid(e),
  );
  const total = items.reduce((acc, e) => acc + toNumber(e.amount), 0);
  const pending = items
    .filter((e) => !isExpensePaid(e))
    .reduce((acc, e) => acc + toNumber(e.amount), 0);

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

  const toggle = (item: Expense) =>
    run(() =>
      updateExpense(item.id, {
        status: isExpensePaid(item) ? "pending" : "paid_by_pool",
        ...(isExpensePaid(item) ? { paidByMemberId: null } : {}),
      }),
      isExpensePaid(item) ? "Voltou para pendente" : `${item.title} paga`,
    );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    const paidBy =
      draft.status === "paid_by_member"
        ? draft.paidByMemberId || user?.id || null
        : null;
    const payload = {
      title: draft.title.trim(),
      amount: parseMoney(draft.amount),
      frequency: draft.frequency,
      dueDate: dateInputToISO(draft.dueDate),
      isShared: draft.isShared,
      status: draft.status,
      paidByMemberId: paidBy,
      billingMonth: month,
    };
    const ok = await run(
      () => (draft.id ? updateExpense(draft.id, payload) : createExpense(payload)),
      draft.id ? "Conta atualizada" : "Conta adicionada",
    );
    setSaving(false);
    if (ok) setDraft(null);
  };

  const remove = async () => {
    if (!draft?.id) return;
    if (await run(() => deleteExpense(draft.id as string), "Conta excluída"))
      setDraft(null);
  };

  const copyPrevious = () =>
    run(async () => {
      const previous = await listExpenses(shiftMonth(month, -1), "monthly");
      await Promise.all(
        previous.map((p) =>
          createExpense({
            title: p.title.replace(/\s*\(Atrasado\)/i, ""),
            amount: toNumber(p.amount),
            frequency: p.frequency,
            dueDate: nextMonthISO(p.dueDate),
            isShared: p.isShared,
            status: "pending",
            billingMonth: month,
          }),
        ),
      );
    }, "Contas fixas copiadas");

  const openEdit = (item: Expense) =>
    setDraft({
      id: item.id,
      title: item.title,
      amount: formatBRL(item.amount),
      dueDate: isoToDateInput(item.dueDate),
      frequency: item.frequency,
      isShared: item.isShared,
      status: item.status,
      paidByMemberId: item.paidByMemberId ?? "",
    });

  return (
    <AppLayout
      title="Contas do mês"
      action={
        <PillButton $small onClick={() => setDraft({ ...emptyDraft })}>
          <Plus weight="bold" /> Nova
        </PillButton>
      }
    >
      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>
            <Receipt weight="fill" /> Total das contas
          </small>
          <strong>{formatBRL(total)}</strong>
        </Stat>
        <Stat $highlight>
          <small>
            <Clock weight="fill" /> Falta pagar
          </small>
          <strong>{formatBRL(pending)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      <Chips>
        <Chip $active={filter === "all"} onClick={() => setFilter("all")}>
          Todas ({items.length})
        </Chip>
        <Chip
          $active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          Pendentes
        </Chip>
        <Chip $active={filter === "paid"} onClick={() => setFilter("paid")}>
          Pagas
        </Chip>
      </Chips>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Card>
        <CardTitle icon={<Receipt weight="fill" />} tone="info">
          Contas
        </CardTitle>
        {visible.length > 0 && (
          <Muted>Arraste para o lado para editar ou excluir.</Muted>
        )}
        {loading && !data ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Receipt weight="duotone" />}
            tone="info"
            title="Nenhuma conta neste mês"
            action={
              <PillButton $variant="outline" $small onClick={copyPrevious}>
                <Copy weight="bold" /> Copiar contas fixas do mês anterior
              </PillButton>
            }
          >
            Luz, água, internet, aluguel...
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState icon={<Funnel weight="duotone" />} title="Nada com esse filtro" />
        ) : (
          <List>
            {visible.map((item) => {
              const paid = isExpensePaid(item);
              return (
                <SwipeRow
                  key={item.id}
                  done={paid}
                  onEdit={() => openEdit(item)}
                  onDelete={() =>
                    run(() => deleteExpense(item.id), "Conta excluída")
                  }
                >
                  <CheckButton
                    $checked={paid}
                    aria-label={paid ? "Desmarcar pagamento" : "Marcar como pago"}
                    onClick={() => toggle(item)}
                  >
                    {paid && <Check weight="bold" />}
                  </CheckButton>
                  <ItemMain onClick={() => openEdit(item)}>
                    <ItemTitle $done={paid}>{item.title}</ItemTitle>
                    <Row>
                      {item.dueDate && (
                        <Muted>Vence {formatDay(item.dueDate)}</Muted>
                      )}
                      {!item.isShared && <Badge $tone="primary">Só minha</Badge>}
                      {item.status === "paid_by_member" && (
                        <Badge $tone="success">
                          {item.paidByMember?.name ?? "Membro"} pagou
                        </Badge>
                      )}
                    </Row>
                  </ItemMain>
                  <Amount>{formatBRL(item.amount)}</Amount>
                </SwipeRow>
              );
            })}
          </List>
        )}
      </Card>

      {draft && (
        <Sheet
          title={draft.id ? "Editar conta" : "Nova conta"}
          onClose={() => setDraft(null)}
          closing={closing}
        >
          <Form onSubmit={save}>
            <Field>
              Descrição
              <TextInput
                required
                minLength={2}
                placeholder="Ex: Energia"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Row $gap="0.75rem">
              <Field>
                Valor
                <MoneyInput
                  value={draft.amount}
                  onChange={(amount) => setDraft({ ...draft, amount })}
                />
              </Field>
              <Field>
                Vencimento
                <TextInput
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) =>
                    setDraft({ ...draft, dueDate: e.target.value })
                  }
                />
              </Field>
            </Row>
            <Field as="div">
              De quem é
              <Segmented>
                <SegmentButton
                  type="button"
                  $active={draft.isShared}
                  onClick={() => setDraft({ ...draft, isShared: true })}
                >
                  Da casa
                </SegmentButton>
                <SegmentButton
                  type="button"
                  $active={!draft.isShared}
                  onClick={() => setDraft({ ...draft, isShared: false })}
                >
                  Só minha
                </SegmentButton>
              </Segmented>
            </Field>
            <Field>
              Repete
              <Select
                value={draft.frequency}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    frequency: e.target.value as ExpenseFrequency,
                  })
                }
              >
                <option value="monthly">Todo mês (conta fixa)</option>
                <option value="weekly">Toda semana</option>
                <option value="daily">Todo dia</option>
              </Select>
            </Field>
            <Field>
              Situação
              <Select
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as ExpenseStatus })
                }
              >
                {(Object.keys(expenseStatusLabel) as ExpenseStatus[]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {expenseStatusLabel[s]}
                    </option>
                  ),
                )}
              </Select>
            </Field>
            {draft.status === "paid_by_member" && (
              <Field>
                Quem pagou
                <Select
                  value={draft.paidByMemberId || user?.id || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, paidByMemberId: e.target.value })
                  }
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            <PillButton type="submit" $full disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </PillButton>
            {draft.id && (
              <PillButton type="button" $variant="outline" $full onClick={remove}>
                Excluir
              </PillButton>
            )}
          </Form>
        </Sheet>
      )}
    </AppLayout>
  );
};

export default Bills;
