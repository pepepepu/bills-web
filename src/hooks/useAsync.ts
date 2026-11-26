import { useCallback, useEffect, useState } from "react";

/**
 * Carrega dados e expõe reload(), loading e error.
 * Ao trocar as deps (ex.: mês) os dados são limpos para mostrar o skeleton;
 * reload() depois de uma ação mantém os dados na tela enquanto atualiza.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await run());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    setData(null);
    reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
