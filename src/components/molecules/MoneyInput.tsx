import { CurrencyCircleDollar } from "@phosphor-icons/react";
import { Input } from "../atoms";

interface MoneyInputProps {
  value: string;
  onChange: (masked: string) => void;
  autoFocus?: boolean;
  id?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Campo de dinheiro padrão: digita só números e formata em reais com
 * vírgula nos centavos e ponto nos milhares ("R$ 1.234,56").
 */
const MoneyInput = ({
  value,
  onChange,
  autoFocus,
  id,
  required,
  placeholder = "R$ 0,00",
  disabled,
}: MoneyInputProps) => (
  <Input
    id={id}
    mask="money"
    inputMode="numeric"
    placeholder={placeholder}
    value={value}
    autoFocus={autoFocus}
    required={required}
    disabled={disabled}
    withIcon
    icon={<CurrencyCircleDollar />}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default MoneyInput;
