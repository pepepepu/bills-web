import { useState } from "react";
import { useSheetState } from "../../hooks/useSheetState";
import { useToast } from "../../hooks/useToast";
import {
  Basket,
  Broom,
  Carrot,
  Check,
  Drop,
  Package,
  Plus,
  ShoppingCart,
  Storefront,
  Receipt,
} from "@phosphor-icons/react";
import { useCreateParam } from "../../hooks/useCreateParam";
import {
  AppLayout,
  Amount,
  Card,
  CardTitle,
  CheckButton,
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
  Sheet,
  Stat,
  SwipeRow,
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

/** Ícone e cor do título de cada categoria. */
const categoryLook = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes("feira") || c.includes("hortifruti"))
    return { icon: <Carrot weight="fill" />, tone: "success" as const };
  if (c.includes("limpeza")) return { icon: <Broom weight="fill" />, tone: "teal" as const };
  if (c.includes("higiene")) return { icon: <Drop weight="fill" />, tone: "info" as const };
  if (c.includes("mercado") || c.includes("assa"))
    return { icon: <Basket weight="fill" />, tone: "warning" as const };
  if (c.includes("loja")) return { icon: <Storefront weight="fill" />, tone: "purple" as const };
  return { icon: <Package weight="fill" />, tone: "indigo" as const };
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

  useCreateParam(() => setDraft({ ...emptyDraft }));

  const openEdit = (s: Supply) =>
    setDraft({
      id: s.id,
      itemName: s.itemName,
      category: s.category,
      estimatedCost: formatBRL(s.estimatedCost),
      actualCost: formatBRL(s.actualCost),
    });

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
          <Plus weight="bold" /> Item
        </PillButton>
      }
    >
      {loading && !data ? (
        <TotalsSkeleton count={2} />
      ) : (
        <TotalsGrid>
        <Stat>
          <small>
            <Receipt weight="fill" /> Previsto
          </small>
          <strong>{formatBRL(estimated)}</strong>
        </Stat>
        <Stat $highlight>
          <small>
            <ShoppingCart weight="fill" /> Já gasto
          </small>
          <strong>{formatBRL(spent)}</strong>
        </Stat>
      </TotalsGrid>
      )}

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {loading && !data ? (
        <Card>
          <Loading />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ShoppingCart weight="duotone" />}
            tone="warning"
            title="Lista de compras vazia"
            action={
              <PillButton
                $variant="outline"
                $small
                onClick={() => setDraft({ ...emptyDraft })}
              >
                <Plus weight="bold" /> Adicionar item
              </PillButton>
            }
          >
            Mercado, feira, limpeza... tudo que a casa precisa no mês.
          </EmptyState>
        </Card>
      ) : (
        categories.map((cat) => (
          <Card key={cat}>
            <CardTitle {...categoryLook(cat)}>{cat}</CardTitle>
            <List>
              {items
                .filter((s) => s.category === cat)
                .map((s) => (
                  <SwipeRow
                    key={s.id}
                    done={s.isPurchased}
                    onEdit={() => openEdit(s)}
                    onDelete={() =>
                      run(() => deleteSupply(s.id), "Item excluído")
                    }
                  >
                    <CheckButton
                      $checked={s.isPurchased}
                      aria-label={s.isPurchased ? "Desmarcar" : "Comprado"}
                      onClick={() => toggle(s)}
                    >
                      {s.isPurchased && <Check weight="bold" />}
                    </CheckButton>
                    <ItemMain onClick={() => openEdit(s)}>
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
                  </SwipeRow>
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
          <Form onSubmit={save} disabled={saving}>
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
              {saving ? "Salvando..." : "Salvar"}
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
