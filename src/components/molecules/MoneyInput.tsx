import { useTheme } from "styled-components";
import { Input } from "../atoms";

interface MoneyInputProps {
  value: string;
  onChange: (masked: string) => void;
  autoFocus?: boolean;
  id?: string;
}

/** Input atom com máscara "money" no visual dos formulários. */
const MoneyInput = ({ value, onChange, autoFocus, id }: MoneyInputProps) => {
  const theme = useTheme();
  return (
    <Input
      id={id}
      mask="money"
      inputMode="numeric"
      placeholder="R$ 0,00"
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      height={46}
      fontSize="1rem"
      backgroundColor={theme.colors.surface}
      border={`1px solid ${theme.colors.border}`}
      onFocusBorderColor={theme.colors.primary}
      textColor={theme.colors.text.body}
      placeholderColor={theme.colors.text.muted}
    />
  );
};

export default MoneyInput;
