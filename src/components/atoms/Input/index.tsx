import React, { forwardRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { fieldFocus, fieldPadding, fieldSurface } from "../../../styles/field";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "width" | "height"
> {
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  margin?: number | string;
  backgroundColor?: string;
  border?: string;
  textColor?: string;
  placeholderColor?: string;
  withIcon?: boolean;
  icon?: React.ReactNode;
  flex?: number | string;
  onFocusBorderColor?: string;
  fontSize?: number | string;
  iconsSize?: number | string;
  mask?: "money" | "phone" | "cpf" | "date" | "password";
}

interface WrapperProps {
  $width?: number | string;
  $height?: number | string;
  $margin?: number | string;
  $flex?: number | string;
  $backgroundColor?: string;
  $border?: string;
  $onFocusBorderColor?: string;
  $isFocused: boolean;
  $disabled?: boolean;
}

interface StyledInputProps {
  $padding?: number | string;
  $textColor?: string;
  $placeholderColor?: string;
  $fontSize?: number | string;
}

interface IconContainerProps {
  $size?: number | string;
  $color?: string;
}

const formatValue = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const formatMoney = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";
  const numeric = Number(digits) / 100;
  return numeric.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)})${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const formatCpf = (val: string) => {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatDate = (val: string) => {
  const digits = val.replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const applyMask = (val: string, mask?: InputProps["mask"]) => {
  if (!mask) return val;
  switch (mask) {
    case "money":
      return formatMoney(val);
    case "phone":
      return formatPhone(val);
    case "cpf":
      return formatCpf(val);
    case "date":
      return formatDate(val);
    default:
      return val;
  }
};

const Container = styled.div<WrapperProps>`
  ${fieldSurface}
  display: flex;
  align-items: center;
  width: ${({ $width }) => formatValue($width) || "100%"};
  ${({ $height }) => ($height ? `height: ${formatValue($height)};` : "")}
  ${({ $margin }) => ($margin ? `margin: ${formatValue($margin)};` : "")}
  ${({ $flex }) => ($flex !== undefined ? `flex: ${$flex};` : "")}
  ${({ $backgroundColor }) =>
    $backgroundColor ? `background-color: ${$backgroundColor};` : ""}
  ${({ $border }) => ($border ? `border: ${$border};` : "")}
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "text")};
  box-sizing: border-box;

  &:focus-within {
    ${fieldFocus}
    ${({ $onFocusBorderColor }) =>
      $onFocusBorderColor ? `border-color: ${$onFocusBorderColor};` : ""}
  }
`;

const StyledInputField = styled.input<StyledInputProps>`
  width: 100%;
  height: 100%;
  min-height: 48px;
  border: none;
  outline: none;
  background: transparent;
  padding: ${({ $padding }) => formatValue($padding) || fieldPadding};
  ${({ $textColor }) =>
    $textColor
      ? `color: ${$textColor}; -webkit-text-fill-color: ${$textColor};`
      : ""}
  font-size: ${({ $fontSize }) => formatValue($fontSize) || "1rem"};
  font-family: inherit;
  font-variant-numeric: tabular-nums;

  &::placeholder {
    ${({ $placeholderColor }) =>
      $placeholderColor
        ? `color: ${$placeholderColor}; -webkit-text-fill-color: ${$placeholderColor};`
        : ""}
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconSlot = styled.div<IconContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.95rem;
  margin-right: -0.35rem;
  color: ${({ $color, theme }) => $color || theme.colors.text.muted};
  font-size: ${({ $size }) => formatValue($size) || "1.2rem"};
  flex-shrink: 0;
  transition: color 0.2s ease;

  ${Container}:focus-within & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const VisibilityButton = styled.button<IconContainerProps>`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.95rem;
  align-self: stretch;
  color: ${({ $color, theme }) => $color || theme.colors.text.muted};
  font-size: ${({ $size }) => formatValue($size) || "1.2rem"};
  flex-shrink: 0;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      width,
      height,
      padding,
      margin,
      backgroundColor,
      border,
      textColor,
      placeholderColor,
      withIcon,
      icon,
      flex,
      style,
      onFocusBorderColor,
      fontSize,
      iconsSize,
      type = "text",
      mask,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>(() => {
      const initial =
        value !== undefined
          ? value
          : defaultValue !== undefined
            ? defaultValue
            : "";
      return applyMask(String(initial), mask);
    });

    useEffect(() => {
      if (value !== undefined) {
        setCurrentValue(applyMask(String(value), mask));
      }
    }, [value, mask]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const maskedValue = applyMask(rawValue, mask);
      setCurrentValue(maskedValue);
      e.target.value = maskedValue;

      if (onChange) {
        onChange(e);
      }
    };

    const getInputType = () => {
      if (mask === "password") {
        return showPassword ? "text" : "password";
      }
      return type;
    };

    return (
      <Container
        style={style}
        $width={width}
        $height={height}
        $margin={margin}
        $flex={flex}
        $backgroundColor={backgroundColor}
        $border={border}
        $onFocusBorderColor={onFocusBorderColor}
        $isFocused={isFocused}
        $disabled={disabled}
      >
        {withIcon && icon && (
          <IconSlot $size={iconsSize} $color={placeholderColor || textColor}>
            {icon}
          </IconSlot>
        )}

        <StyledInputField
          ref={ref}
          type={getInputType()}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          $padding={padding}
          $textColor={textColor}
          $placeholderColor={placeholderColor}
          $fontSize={fontSize}
          {...rest}
        />

        {mask === "password" && (
          <VisibilityButton
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            $size={iconsSize}
            $color={placeholderColor || textColor}
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </VisibilityButton>
        )}
      </Container>
    );
  },
);

Input.displayName = "Input";

export default Input;
