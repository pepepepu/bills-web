import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import { PiCheckBold, PiPlusBold } from "react-icons/pi";
import {
  AppLayout,
  Amount,
  Card,
  CardSkeleton,
  CheckButton,
  EmptyState,
  ErrorBanner,
  Field,
  Form,
  ItemMain,
  ItemTitle,
  List,
  ListItem,
  MoneyInput,
  Muted,
  PillButton,
  Row,
  SectionTitle,
  Sheet,
  Stat,
  TextInput,
  TotalsGrid,
  TotalsSkeleton,
} from "../../components";
import { useAsync } from "../../hooks/useAsync";
import { useMonth } from "../../hooks/useMonth";
import type { Supply } from "../../interfaces/finance";
import {
  createSupply,
  deleteSupply,
  listSupplies,
  toggleSupply,
  updateSupply,
} from "../../services/supplyServices";
import { formatBRL, parseMoney, toNumber } from "../../utils/format";

type Draft = {
  id?: string;
  itemName: string;
  category: string;
  estimatedCost: string;
  actualCost: string;
};

const emptyDraft: Draft = {
  itemName: "",
  category: "Mercado",
  estimatedCost: "",
  actualCost: "",
};

const Supplies = () => {
  const { month } = useMonth();
  const { data, loading, error, reload } = useAsync(
    () => listSupplies(month),
    [month],
  );
  const [draft, setDraft, closing] = useSheetState<Draft>();
  const toast = useToast();
  const items = data ?? [];

  const estimated = items.reduce((a, s) => a + toNumber(s.estimatedCost), 0);
  const spent = items
    .filter((s) => s.isPurchased)
    .reduce((a, s) => a + toNumber(s.actualCost || s.estimatedCost), 0);

  const categories = [...new Set(items.map((s) => s.category))].sort();

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

  const toggle = (s: Supply) =>
    run(() =>
      toggleSupply(
        s.id,
        !s.isPurchased && !toNumber(s.actualCost)
          ? toNumber(s.estimatedCost)
          : undefined,
      ),
      s.isPurchased ? undefined : `${s.itemName} comprado`,
    );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const payload = {
      itemName: draft.itemName.trim(),
      category: draft.category.trim() || "Outros",
      estimatedCost: parseMoney(draft.estimatedCost),
      actualCost: parseMoney(draft.actualCost),
      billingMonth: month,
    };
    const ok = await run(
      () => (draft.id ? updateSupply(draft.id, payload) : createSupply(payload)),
      draft.id ? "Item atualizado" : "Item adicionado",
    );
    if (ok) setDraft(null);
  };

  return (
    <AppLayout
      title="Compras da casa"
      action={
        <PillButton $small onClick={() => setDraft({ ...emptyDraft })}>
          <PiPlusBold /> Item
        </PillButton>
      }
    >
      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>Previsto</small>
          <strong>{formatBRL(estimated)}</strong>
        </Stat>
        <Stat $highlight>
          <small>Já gasto</small>
          <strong>{formatBRL(spent)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading && !data ? (
        <CardSkeleton />
      ) : items.length === 0 ? (
        <Card>
          <EmptyState>Lista de compras vazia neste mês.</EmptyState>
        </Card>
      ) : (
        categories.map((cat) => (
          <Card key={cat}>
            <SectionTitle>{cat}</SectionTitle>
            <List>
              {items
                .filter((s) => s.category === cat)
                .map((s) => (
                  <ListItem key={s.id} $done={s.isPurchased}>
                    <CheckButton
                      $checked={s.isPurchased}
                      aria-label={s.isPurchased ? "Desmarcar" : "Comprado"}
                      onClick={() => toggle(s)}
                    >
                      {s.isPurchased && <PiCheckBold />}
                    </CheckButton>
                    <ItemMain
                      onClick={() =>
                        setDraft({
                          id: s.id,
                          itemName: s.itemName,
                          category: s.category,
                          estimatedCost: formatBRL(s.estimatedCost),
                          actualCost: formatBRL(s.actualCost),
                        })
                      }
                    >
                      <ItemTitle $done={s.isPurchased}>{s.itemName}</ItemTitle>
                      <Muted>Previsto {formatBRL(s.estimatedCost)}</Muted>
                    </ItemMain>
                    <Amount>
                      {formatBRL(
                        s.isPurchased
                          ? s.actualCost || s.estimatedCost
                          : s.estimatedCost,
                      )}
                    </Amount>
                  </ListItem>
                ))}
            </List>
          </Card>
        ))
      )}

      {draft && (
        <Sheet
          title={draft.id ? "Editar item" : "Novo item"}
          onClose={() => setDraft(null)}
          closing={closing}
        >
          <Form onSubmit={save}>
            <Field>
              Item
              <TextInput
                required
                placeholder="Ex: Feira, Assaí, Bujão"
                value={draft.itemName}
                onChange={(e) =>
                  setDraft({ ...draft, itemName: e.target.value })
                }
              />
            </Field>
            <Field>
              Categoria
              <TextInput
                list="supply-categories"
                placeholder="Ex: Mercado"
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              />
              <datalist id="supply-categories">
                {[...new Set(["Mercado", "Feira", "Limpeza", "Higiene", ...categories])].map(
                  (c) => (
                    <option key={c} value={c} />
                  ),
                )}
              </datalist>
            </Field>
            <Row $gap="0.75rem">
              <Field>
                Previsto
                <MoneyInput
                  value={draft.estimatedCost}
                  onChange={(estimatedCost) =>
                    setDraft({ ...draft, estimatedCost })
                  }
                />
              </Field>
              <Field>
                Gasto real
                <MoneyInput
                  value={draft.actualCost}
                  onChange={(actualCost) => setDraft({ ...draft, actualCost })}
                />
              </Field>
            </Row>
            <PillButton type="submit" $full>
              Salvar
            </PillButton>
            {draft.id && (
              <PillButton
                type="button"
                $variant="outline"
                $full
                onClick={async () => {
                  if (await run(() => deleteSupply(draft.id as string), "Item excluído"))
                    setDraft(null);
                }}
              >
                Excluir
              </PillButton>
            )}
          </Form>
        </Sheet>
      )}
    </AppLayout>
  );
};

export default Supplies;
