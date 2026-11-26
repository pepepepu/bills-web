import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import { PiCheckBold, PiCopyBold, PiPlusBold } from "react-icons/pi";
import {
  AppLayout,
  Amount,
  Badge,
  Card,
  CheckButton,
  EmptyState,
  ErrorBanner,
  Field,
  Form,
  InfoBanner,
  ItemMain,
  ItemTitle,
  ListSkeleton,
  List,
  ListItem,
  MoneyInput,
  Muted,
  PillButton,
  Row,
  Segmented,
  SegmentButton,
  Sheet,
  Stat,
  TextInput,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useMonth } from "../../hooks/useMonth";
import type { Income } from "../../interfaces/finance";
import {
  createIncome,
  deleteIncome,
  listIncomes,
  updateIncome,
} from "../../services/incomeServices";
import { formatBRL, parseMoney, shiftMonth } from "../../utils/format";

export const sumIncomes = (items: Income[]) => {
  const gross = items.reduce((acc, i) => acc + i.amount, 0);
  const net = items
    .filter((i) => !i.isVoucher)
    .reduce((acc, i) => acc + i.amount, 0);
  const received = items
    .filter((i) => !i.isVoucher && i.received)
    .reduce((acc, i) => acc + i.amount, 0);
  return { gross, net, received };
};

type Draft = {
  id?: string;
  title: string;
  amount: string;
  received: boolean;
  isVoucher: boolean;
};

const emptyDraft: Draft = {
  title: "",
  amount: "",
  received: false,
  isVoucher: false,
};

const Incomes = () => {
  const { month } = useMonth();
  const { data, loading, error, reload } = useAsync(
    () => listIncomes(month),
    [month],
  );
  const [draft, setDraft, closing] = useSheetState<Draft>();
  const toast = useToast();
  const items = data ?? [];
  const totals = sumIncomes(items);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const payload = {
      title: draft.title.trim(),
      amount: parseMoney(draft.amount),
      received: draft.received,
      isVoucher: draft.isVoucher,
      billingMonth: month,
    };
    if (draft.id) await updateIncome(draft.id, payload);
    else await createIncome(payload);
    setDraft(null);
    toast.success(draft.id ? "Entrada atualizada" : "Entrada adicionada");
    reload();
  };

  const toggle = async (item: Income) => {
    await updateIncome(item.id, { received: !item.received });
    if (!item.received) toast.success(`${item.title} entrou`);
    reload();
  };

  const remove = async () => {
    if (!draft?.id) return;
    await deleteIncome(draft.id);
    setDraft(null);
    toast.success("Entrada excluída");
    reload();
  };

  const copyPrevious = async () => {
    const previous = await listIncomes(shiftMonth(month, -1));
    await Promise.all(
      previous.map((p) =>
        createIncome({
          title: p.title,
          amount: p.amount,
          isVoucher: p.isVoucher,
          received: false,
          billingMonth: month,
        }),
      ),
    );
    toast.success(
      previous.length
        ? `${previous.length} entradas copiadas`
        : "O mês anterior não tem entradas",
    );
    reload();
  };

  return (
    <AppLayout
      title="Entradas"
      action={
        <PillButton $small onClick={() => setDraft({ ...emptyDraft })}>
          <PiPlusBold /> Nova
        </PillButton>
      }
    >
      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>Total bruto</small>
          <strong>{formatBRL(totals.gross)}</strong>
        </Stat>
        <Stat $highlight>
          <small>Total líquido</small>
          <strong>{formatBRL(totals.net)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      <InfoBanner>
        As entradas ainda ficam salvas só neste navegador, porque a API não tem
        um endpoint de entradas.
      </InfoBanner>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Card>
        <Row $justify="space-between">
          <Muted>
            Já entrou {formatBRL(totals.received)} de {formatBRL(totals.net)}
          </Muted>
        </Row>
        {loading && !data ? (
          <ListSkeleton rows={3} />
        ) : items.length === 0 ? (
          <EmptyState>
            Nenhuma entrada neste mês.
            <Row $justify="center" style={{ marginTop: "1rem" }}>
              <PillButton $variant="outline" $small onClick={copyPrevious}>
                <PiCopyBold /> Copiar do mês anterior
              </PillButton>
            </Row>
          </EmptyState>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem key={item.id} $done={item.received}>
                <CheckButton
                  $checked={item.received}
                  aria-label={item.received ? "Marcar como não entrou" : "Marcar como entrou"}
                  onClick={() => toggle(item)}
                >
                  {item.received && <PiCheckBold />}
                </CheckButton>
                <ItemMain
                  onClick={() =>
                    setDraft({
                      id: item.id,
                      title: item.title,
                      amount: formatBRL(item.amount),
                      received: item.received,
                      isVoucher: item.isVoucher,
                    })
                  }
                >
                  <ItemTitle>{item.title}</ItemTitle>
                  <Row>
                    {item.received ? (
                      <Badge $tone="success">Entrou</Badge>
                    ) : (
                      <Badge>Aguardando</Badge>
                    )}
                    {item.isVoucher && <Badge $tone="primary">Vale</Badge>}
                  </Row>
                </ItemMain>
                <Amount $tone="success">{formatBRL(item.amount)}</Amount>
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      {draft && (
        <Sheet
          title={draft.id ? "Editar entrada" : "Nova entrada"}
          onClose={() => setDraft(null)}
          closing={closing}
        >
          <Form onSubmit={save}>
            <Field>
              Descrição
              <TextInput
                required
                minLength={2}
                placeholder="Ex: Salário - Pedro"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field>
              Valor
              <MoneyInput
                value={draft.amount}
                onChange={(amount) => setDraft({ ...draft, amount })}
              />
            </Field>
            <Field as="div">
              Tipo
              <Segmented>
                <SegmentButton
                  type="button"
                  $active={!draft.isVoucher}
                  onClick={() => setDraft({ ...draft, isVoucher: false })}
                >
                  Dinheiro
                </SegmentButton>
                <SegmentButton
                  type="button"
                  $active={draft.isVoucher}
                  onClick={() => setDraft({ ...draft, isVoucher: true })}
                >
                  Vale (fora do líquido)
                </SegmentButton>
              </Segmented>
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
            <PillButton type="submit" $full>
              Salvar
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

export default Incomes;
