import { useState } from "react";
import {
  CalendarCheck,
  Check,
  Clock,
  LockSimple,
  Plus,
  Repeat,
  Trash,
  UsersThree,
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
  InfoBanner,
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
  TodayCard,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../hooks/useAuth";
import { useCreateParam } from "../../hooks/useCreateParam";
import { useMonth } from "../../hooks/useMonth";
import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import type {
  MonthSubscription,
  SubscriptionType,
} from "../../interfaces/finance";
import {
  createSubscription,
  deleteSubscription,
  listSubscriptions,
  toggleSubscription,
  updateSubscription,
} from "../../services/subscriptionServices";
import {
  formatBRL,
  parseMoney,
  shiftMonth,
  shortMonthLabel,
  todayISODate,
  toNumber,
} from "../../utils/format";

type Filter = "all" | "family" | "individual";

type Draft = {
  id?: string;
  title: string;
  amount: string;
  billingDay: string;
  type: SubscriptionType;
  splitCount: string;
  startMonth: string;
  endMonth: string;
};

const Subscriptions = () => {
  const { month } = useMonth();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(
    () => listSubscriptions(month),
    [month],
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft, closing] = useSheetState<Draft>();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const items = data ?? [];
  const visible = items.filter((s) => filter === "all" || s.type === filter);
  const total = items.reduce((acc, s) => acc + toNumber(s.amount), 0);
  const pending = items
    .filter((s) => !s.paid)
    .reduce((acc, s) => acc + toNumber(s.amount), 0);

  const newDraft = (): Draft => ({
    title: "",
    amount: "",
    billingDay: "",
    type: "individual",
    splitCount: "1",
    startMonth: month,
    endMonth: "",
  });

  useCreateParam(() => setDraft(newDraft()));

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

  const openEdit = (s: MonthSubscription) =>
    setDraft({
      id: s.id,
      title: s.title,
      amount: formatBRL(s.amount),
      billingDay: String(s.billingDay),
      type: s.type,
      splitCount: String(s.splitCount),
      startMonth: s.startMonth,
      endMonth: s.endMonth ?? "",
    });

  const toggle = (s: MonthSubscription) =>
    run(
      () => toggleSubscription(s.id, month),
      s.paid ? "Voltou para pendente" : `${s.title} paga`,
    );

  /** Para de cobrar a partir deste mês (os meses anteriores ficam). */
  const remove = (s: { id: string; title: string; startMonth: string }) =>
    run(
      () => deleteSubscription(s.id, month),
      s.startMonth < month
        ? `${s.title} encerrada a partir de ${shortMonthLabel(month)}`
        : "Assinatura excluída",
    );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const billingDay = Number(draft.billingDay);
    const splitCount = Math.max(1, Number(draft.splitCount) || 1);
    if (!billingDay || billingDay < 1 || billingDay > 31) {
      toast.error("Informe o dia da cobrança (1 a 31).");
      return;
    }
    if (draft.endMonth && draft.endMonth < draft.startMonth) {
      toast.error("O prazo não pode ser antes do primeiro mês.");
      return;
    }
    const payload = {
      title: draft.title.trim(),
      amount: parseMoney(draft.amount),
      type: draft.type,
      splitCount: draft.type === "family" ? 1 : splitCount,
      billingDay,
      startMonth: draft.startMonth,
      endMonth: draft.endMonth || null,
    };
    const ok = await run(
      () =>
        draft.id
          ? updateSubscription(draft.id, payload)
          : createSubscription(payload),
      draft.id ? "Assinatura atualizada" : "Assinatura adicionada",
    );
    if (ok) setDraft(null);
  };

  const people = Math.max(1, Number(draft?.splitCount) || 1);
  const draftShare = draft ? parseMoney(draft.amount) / people : 0;

  const today = todayISODate();
  const dueToday = items
    .filter((s) => !s.paid && s.dueDate.slice(0, 10) === today)
    .map((s) => ({
      id: s.id,
      kind: "subscription" as const,
      title: s.title,
      amount: toNumber(s.amount),
      onOpen: () => openEdit(s),
      onPay: () => toggle(s),
    }));

  return (
    <AppLayout
      onRefresh={reload}
      title="Assinaturas"
      action={
        <PillButton $small onClick={() => setDraft(newDraft())}>
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
              <Repeat weight="fill" /> Total no mês
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

      <TodayCard items={dueToday} />

      <Chips>
        <Chip $active={filter === "all"} onClick={() => setFilter("all")}>
          Todas ({items.length})
        </Chip>
        <Chip
          $active={filter === "family"}
          onClick={() => setFilter("family")}
        >
          Da família
        </Chip>
        <Chip
          $active={filter === "individual"}
          onClick={() => setFilter("individual")}
        >
          Só minhas
        </Chip>
      </Chips>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {filter === "individual" && (
        <InfoBanner>
          <LockSimple weight="fill" />
          <span>Suas assinaturas pessoais só aparecem para você.</span>
        </InfoBanner>
      )}

      <Card>
        <CardTitle icon={<Repeat weight="fill" />} tone="teal">
          Assinaturas do mês
        </CardTitle>
        {visible.length > 0 && (
          <Muted>
            Elas se repetem todo mês. Arraste para o lado para editar ou
            encerrar.
          </Muted>
        )}
        {loading && !data ? (
          <Loading />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Repeat weight="duotone" />}
            tone="teal"
            title="Nenhuma assinatura neste mês"
          >
            Streaming, música, academia, nuvem...
          </EmptyState>
        ) : (
          <List>
            {visible.map((s) => {
              const mine = s.ownerMemberId === user?.id;
              return (
                <SwipeRow
                  key={s.id}
                  done={s.paid}
                  onEdit={() => openEdit(s)}
                  onDelete={() => remove(s)}
                >
                  <CheckButton
                    $checked={s.paid}
                    aria-label={s.paid ? "Desmarcar pagamento" : "Marcar como pago"}
                    onClick={() => toggle(s)}
                  >
                    {s.paid && <Check weight="bold" />}
                  </CheckButton>
                  <ItemMain onClick={() => openEdit(s)}>
                    <ItemTitle $done={s.paid}>{s.title}</ItemTitle>
                    <Row>
                      <Muted>Dia {s.billingDay}</Muted>
                      {s.type === "family" ? (
                        <Badge $tone="teal">Família</Badge>
                      ) : (
                        <Badge $tone="primary">Só minha</Badge>
                      )}
                      {s.type === "individual" && s.splitCount > 1 && (
                        <Badge $tone="info">
                          ÷{s.splitCount} · {formatBRL(s.shareAmount)} cada
                        </Badge>
                      )}
                      {s.endMonth && (
                        <Muted>até {shortMonthLabel(s.endMonth)}</Muted>
                      )}
                      {!mine && s.ownerMember && (
                        <Muted>de {s.ownerMember.name.split(" ")[0]}</Muted>
                      )}
                    </Row>
                  </ItemMain>
                  <Amount>{formatBRL(s.amount)}</Amount>
                </SwipeRow>
              );
            })}
          </List>
        )}
      </Card>

      {draft && (
        <Sheet
          title={draft.id ? "Editar assinatura" : "Nova assinatura"}
          onClose={() => setDraft(null)}
          closing={closing}
        >
          <Form onSubmit={save} disabled={saving}>
            <Field>
              Nome
              <TextInput
                required
                minLength={2}
                placeholder="Ex: Netflix"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Row $gap="0.75rem">
              <Field>
                Valor por mês
                <MoneyInput
                  required
                  value={draft.amount}
                  onChange={(amount) => setDraft({ ...draft, amount })}
                />
              </Field>
              <Field>
                Dia da cobrança
                <TextInput
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={31}
                  placeholder="Ex: 10"
                  value={draft.billingDay}
                  onChange={(e) =>
                    setDraft({ ...draft, billingDay: e.target.value })
                  }
                />
              </Field>
            </Row>
            <Field as="div">
              De quem é
              <Segmented>
                <SegmentButton
                  type="button"
                  $active={draft.type === "individual"}
                  onClick={() => setDraft({ ...draft, type: "individual" })}
                >
                  Só minha
                </SegmentButton>
                <SegmentButton
                  type="button"
                  $active={draft.type === "family"}
                  onClick={() => setDraft({ ...draft, type: "family" })}
                >
                  Da família
                </SegmentButton>
              </Segmented>
            </Field>
            {draft.type === "family" ? (
              <Muted>
                <UsersThree weight="fill" /> Cobrada de todos da casa: entra na
                divisão pela renda, como conta paga por quem assina.
              </Muted>
            ) : (
              <>
                <Field>
                  Dividida entre quantas pessoas (contando você)
                  <TextInput
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={20}
                    value={draft.splitCount}
                    onChange={(e) =>
                      setDraft({ ...draft, splitCount: e.target.value })
                    }
                  />
                </Field>
                <Muted>
                  <LockSimple weight="fill" /> Só você vê.
                  {people > 1 &&
                    ` Fica ${formatBRL(draftShare)} para cada um.`}
                </Muted>
              </>
            )}
            <Row $gap="0.75rem">
              <Field>
                Começa em
                <TextInput
                  type="month"
                  required
                  value={draft.startMonth}
                  onChange={(e) =>
                    setDraft({ ...draft, startMonth: e.target.value })
                  }
                />
              </Field>
              <Field>
                Prazo (opcional)
                <TextInput
                  type="month"
                  min={draft.startMonth}
                  value={draft.endMonth}
                  onChange={(e) =>
                    setDraft({ ...draft, endMonth: e.target.value })
                  }
                />
              </Field>
            </Row>
            <Row $gap="0.5rem">
              <PillButton
                type="button"
                $variant="ghost"
                $small
                onClick={() =>
                  setDraft({
                    ...draft,
                    endMonth: shiftMonth(draft.startMonth, 11),
                  })
                }
              >
                <CalendarCheck weight="bold" /> Plano anual (12 meses)
              </PillButton>
              {draft.endMonth && (
                <PillButton
                  type="button"
                  $variant="ghost"
                  $small
                  onClick={() => setDraft({ ...draft, endMonth: "" })}
                >
                  Sem prazo
                </PillButton>
              )}
            </Row>
            <Muted>
              {draft.endMonth
                ? `Aparece todo mês até ${shortMonthLabel(draft.endMonth)}.`
                : "Aparece todo mês até você encerrar."}
            </Muted>
            <PillButton type="submit" $full>
              {saving ? "Salvando..." : "Salvar"}
            </PillButton>
          </Form>
          {draft.id && (
            <PillButton
              type="button"
              $variant="outline"
              $full
              disabled={saving}
              onClick={async () => {
                if (
                  await remove({
                    id: draft.id as string,
                    title: draft.title,
                    startMonth: draft.startMonth,
                  })
                )
                  setDraft(null);
              }}
            >
              <Trash weight="bold" />{" "}
              {draft.startMonth < month
                ? `Encerrar a partir de ${shortMonthLabel(month)}`
                : "Excluir"}
            </PillButton>
          )}
        </Sheet>
      )}
    </AppLayout>
  );
};

export default Subscriptions;
