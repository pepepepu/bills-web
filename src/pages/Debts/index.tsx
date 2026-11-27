import { useState } from "react";
import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import {
  ArrowBendUpRight,
  CalendarPlus,
  Check,
  Clock,
  HandCoins,
  LockSimple,
  Plus,
  StackPlus,
  Trash,
  Warning,
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
  InfoBanner,
  List,
  Loading,
  MoneyInput,
  Muted,
  PillButton,
  Row,
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
import { useMonth } from "../../hooks/useMonth";
import type { Debt, DebtStatus, DebtType } from "../../interfaces/finance";
import {
  createDebt,
  deleteDebt,
  listDebts,
  postponeDebt,
  rolloverDebt,
  updateDebt,
} from "../../services/debtServices";
import {
  dateInputToISO,
  formatBRL,
  formatDay,
  isoToDateInput,
  joinInstallment,
  monthLabel,
  parseMoney,
  shiftMonth,
  splitInstallment,
  toNumber,
} from "../../utils/format";
import {
  debtStatusLabel,
  debtStatusTone,
  isDebtActive,
  isDebtPaid,
} from "../../utils/status";

type Draft = {
  id?: string;
  name: string;
  current: string;
  total: string;
  amount: string;
  dueDate: string;
  type: DebtType;
  status: DebtStatus;
};

const Debts = () => {
  const { month } = useMonth();
  const { user } = useAuth();
  const [tab, setTab] = useState<DebtType>("family");
  const { data, loading, error, reload } = useAsync(
    () => listDebts(month),
    [month],
  );
  const [draft, setDraft, closing] = useSheetState<Draft>();
  const toast = useToast();
  const [postponeTo, setPostponeTo] = useState("");

  const all = data ?? [];
  const items = all
    .filter((d) => d.type === tab)
    .sort((a, b) =>
      (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"),
    );
  const active = items.filter(isDebtActive);
  const total = active.reduce((acc, d) => acc + toNumber(d.amount), 0);
  const open = active
    .filter((d) => !isDebtPaid(d))
    .reduce((acc, d) => acc + toNumber(d.amount), 0);

  const [saving, setSaving] = useState(false);

  const run = async (fn: () => Promise<unknown>, success?: string) => {
    setSaving(true);
    try {
      await fn();
      await reload();
      if (success) toast.success(success);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const newDraft = (): Draft => ({
    name: "",
    current: "",
    total: "",
    amount: "",
    dueDate: "",
    type: tab,
    status: "open",
  });

  useCreateParam(() => setDraft(newDraft()));

  const openEdit = (d: Debt) => {
    const inst = splitInstallment(d.title);
    setPostponeTo("");
    setDraft({
      id: d.id,
      name: inst.name,
      current: inst.current ? String(inst.current) : "",
      total: inst.total ? String(inst.total) : "",
      amount: formatBRL(d.amount),
      dueDate: isoToDateInput(d.dueDate),
      type: d.type,
      status: d.status,
    });
  };

  const toggle = (d: Debt) =>
    run(
      () => updateDebt(d.id, { status: isDebtPaid(d) ? "open" : "paid" }),
      isDebtPaid(d)
        ? "Voltou para em aberto"
        : `${splitInstallment(d.title).name} paga`,
    );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const payload = {
      title: joinInstallment(
        draft.name,
        Number(draft.current) || null,
        Number(draft.total) || null,
      ),
      amount: parseMoney(draft.amount),
      type: draft.type,
      // a API sempre grava a dívida pessoal no nome de quem está logado
      debtorMemberId: draft.type === "individual" ? user?.id : null,
      dueDate: dateInputToISO(draft.dueDate),
      status: draft.status,
      targetMonth: month,
    };
    const ok = await run(
      () => (draft.id ? updateDebt(draft.id, payload) : createDebt(payload)),
      draft.id ? "Dívida atualizada" : "Dívida adicionada",
    );
    if (ok) setDraft(null);
  };

  const postpone = async () => {
    if (!draft?.id || !postponeTo) return;
    const iso = dateInputToISO(postponeTo) as string;
    if (await run(() => postponeDebt(draft.id as string, iso), "Pagamento adiado"))
      setDraft(null);
  };

  const rollover = async () => {
    if (!draft?.id) return;
    if (
      await run(
        () => rolloverDebt(draft.id as string, shiftMonth(month, 1)),
        `Passou para ${monthLabel(shiftMonth(month, 1))}`,
      )
    )
      setDraft(null);
  };

  /** Lança a próxima parcela (n+1/total) no mês seguinte. */
  const nextInstallment = async (d: Debt) => {
    const inst = splitInstallment(d.title);
    if (!inst.current || !inst.total || inst.current >= inst.total) return;
    let due: string | null = null;
    if (d.dueDate) {
      const date = new Date(d.dueDate);
      date.setUTCMonth(date.getUTCMonth() + 1);
      due = date.toISOString();
    }
    await run(() =>
      createDebt({
        title: joinInstallment(inst.name, inst.current! + 1, inst.total),
        amount: toNumber(d.amount),
        type: d.type,
        debtorMemberId: d.debtorMemberId,
        dueDate: due,
        status: "open",
        targetMonth: shiftMonth(d.targetMonth, 1),
      }),
      `Parcela ${inst.current + 1}/${inst.total} lançada`,
    );
  };

  const editing = draft?.id ? all.find((d) => d.id === draft.id) : undefined;
  const editingInst = editing ? splitInstallment(editing.title) : null;

  return (
    <AppLayout
      title="Dívidas"
      action={
        <PillButton $small onClick={() => setDraft(newDraft())}>
          <Plus weight="bold" /> Nova
        </PillButton>
      }
    >
      <Chips>
        <Chip $active={tab === "family"} onClick={() => setTab("family")}>
          Da casa
        </Chip>
        <Chip
          $active={tab === "individual"}
          onClick={() => setTab("individual")}
        >
          Pessoais
        </Chip>
      </Chips>

      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>
            <HandCoins weight="fill" /> Total de dívidas
          </small>
          <strong>{formatBRL(total)}</strong>
        </Stat>
        <Stat $highlight>
          <small>
            <Clock weight="fill" /> Em aberto
          </small>
          <strong>{formatBRL(open)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {tab === "individual" && (
        <InfoBanner>
          <LockSimple weight="fill" />
          <span>Suas dívidas pessoais só aparecem para você.</span>
        </InfoBanner>
      )}

      <Card>
        <CardTitle
          icon={<HandCoins weight="fill" />}
          tone={tab === "family" ? "purple" : "indigo"}
        >
          {tab === "family" ? "Dívidas da casa" : "Minhas dívidas"}
        </CardTitle>
        {items.length > 0 && (
          <Muted>Arraste para o lado para editar ou excluir.</Muted>
        )}
        {loading && !data ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<HandCoins weight="duotone" />}
            tone="purple"
            title="Nenhuma dívida neste mês"
          >
            Que bom! Se tiver alguma, toque em Nova.
          </EmptyState>
        ) : (
          <List>
            {items.map((d) => {
              const paid = isDebtPaid(d);
              const inst = splitInstallment(d.title);
              const moved = d.status === "rolled_over";
              return (
                <SwipeRow
                  key={d.id}
                  done={paid || moved}
                  onEdit={() => openEdit(d)}
                  onDelete={() =>
                    run(() => deleteDebt(d.id), "Dívida excluída")
                  }
                >
                  <CheckButton
                    $checked={paid}
                    disabled={moved}
                    aria-label={paid ? "Desmarcar pagamento" : "Marcar como pago"}
                    onClick={() => toggle(d)}
                  >
                    {paid && <Check weight="bold" />}
                  </CheckButton>
                  <ItemMain onClick={() => openEdit(d)}>
                    <ItemTitle $done={paid}>{inst.name}</ItemTitle>
                    <Row>
                      {inst.current && (
                        <Badge $tone="primary">
                          {inst.current}/{inst.total}
                        </Badge>
                      )}
                      {d.dueDate && <Muted>{formatDay(d.dueDate)}</Muted>}
                      {d.status !== "open" && (
                        <Badge $tone={debtStatusTone(d.status)}>
                          {debtStatusLabel[d.status]}
                        </Badge>
                      )}
                    </Row>
                  </ItemMain>
                  <Amount>{formatBRL(d.amount)}</Amount>
                </SwipeRow>
              );
            })}
          </List>
        )}
      </Card>

      {draft && (
        <Sheet
          title={draft.id ? "Editar dívida" : "Nova dívida"}
          onClose={() => setDraft(null)}
          closing={closing}
        >
          <Form onSubmit={save} disabled={saving}>
            <Field>
              Descrição
              <TextInput
                required
                minLength={2}
                placeholder="Ex: Parcela Ana Karla"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
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
                Data limite
                <TextInput
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) =>
                    setDraft({ ...draft, dueDate: e.target.value })
                  }
                />
              </Field>
            </Row>
            <Row $gap="0.75rem">
              <Field>
                Parcela atual
                <TextInput
                  type="number"
                  min={1}
                  placeholder="-"
                  value={draft.current}
                  onChange={(e) =>
                    setDraft({ ...draft, current: e.target.value })
                  }
                />
              </Field>
              <Field>
                Total de parcelas
                <TextInput
                  type="number"
                  min={1}
                  placeholder="-"
                  value={draft.total}
                  onChange={(e) => setDraft({ ...draft, total: e.target.value })}
                />
              </Field>
            </Row>
            <Field>
              De quem é
              <Select
                value={draft.type}
                onChange={(e) =>
                  setDraft({ ...draft, type: e.target.value as DebtType })
                }
              >
                <option value="family">Da casa</option>
                <option value="individual">Pessoal (só minha)</option>
              </Select>
            </Field>
            {draft.type === "individual" && (
              <Muted>
                <LockSimple weight="fill" /> Fica no seu nome e só você vê.
              </Muted>
            )}
            {draft.id && (
              <Field>
                Situação
                <Select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value as DebtStatus })
                  }
                >
                  {(Object.keys(debtStatusLabel) as DebtStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {debtStatusLabel[s]}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            <PillButton type="submit" $full>
              {saving ? "Salvando..." : "Salvar"}
            </PillButton>
          </Form>

          {editing && editing.status !== "rolled_over" && (
            <Card>
              <CardTitle icon={<Warning weight="fill" />} tone="warning">
                Não vai dar pra pagar agora?
              </CardTitle>
              <Row $gap="0.5rem" $justify="space-between">
                <TextInput
                  type="date"
                  aria-label="Nova data"
                  disabled={saving}
                  value={postponeTo}
                  onChange={(e) => setPostponeTo(e.target.value)}
                />
                <PillButton
                  type="button"
                  $variant="ghost"
                  $small
                  disabled={saving || !postponeTo}
                  onClick={postpone}
                >
                  <CalendarPlus weight="bold" /> Adiar
                </PillButton>
              </Row>
              <PillButton
                type="button"
                $variant="ghost"
                $full
                disabled={saving}
                onClick={rollover}
              >
                <ArrowBendUpRight weight="bold" /> Passar para{" "}
                {monthLabel(shiftMonth(month, 1))}
              </PillButton>
              {editingInst?.current &&
                editingInst.total &&
                editingInst.current < editingInst.total && (
                  <PillButton
                    type="button"
                    $variant="ghost"
                    $full
                    disabled={saving}
                    onClick={async () => {
                      await nextInstallment(editing);
                      setDraft(null);
                    }}
                  >
                    <StackPlus weight="bold" /> Lançar parcela {editingInst.current + 1}/
                    {editingInst.total} no próximo mês
                  </PillButton>
                )}
            </Card>
          )}

          {draft.id && (
            <PillButton
              type="button"
              $variant="outline"
              $full
              onClick={async () => {
                if (await run(() => deleteDebt(draft.id as string), "Dívida excluída"))
                  setDraft(null);
              }}
            >
              <Trash weight="bold" /> Excluir
            </PillButton>
          )}
        </Sheet>
      )}
    </AppLayout>
  );
};

export default Debts;
