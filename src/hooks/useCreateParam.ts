import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * O menu "Novo" da barra leva para a tela com ?novo=1.
 * Este hook abre o formulário de criação e limpa o parâmetro.
 */
export function useCreateParam(open: () => void) {
  const [params, setParams] = useSearchParams();
  const wants = params.get("novo") === "1";

  useEffect(() => {
    if (!wants) return;
    open();
    setParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wants]);
}
