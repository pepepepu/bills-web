import React, { forwardRef } from "react";
import styled from "styled-components";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  height?: number | string;
  width?: number | string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: number | string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
  position?: string;
  margin?: number | string;
  padding?: number | string;
  backgroundColor?: string;
  color?: string;
  border?: string;
  borderRadius?: number | string;
  flexShrink?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  flex?: number | string;
  fontSize?: string;
  fontWeight?: string | number;
  cursor?: string;
  transition?: string;
}

interface StyledProps {
  $height?: number | string;
  $width?: number | string;
  $display?: string;
  $flexDirection?: string;
  $justifyContent?: string;
  $alignItems?: string;
  $alignContent?: string;
  $gap?: number | string;
  $overflow?: string;
  $overflowX?: string;
  $overflowY?: string;
  $position?: string;
  $margin?: number | string;
  $padding?: number | string;
  $backgroundColor?: string;
  $color?: string;
  $border?: string;
  $borderRadius?: number | string;
  $flexShrink?: number | string;
  $minHeight?: number | string;
  $minWidth?: number | string;
  $flex?: number | string;
  $fontSize?: string;
  $fontWeight?: string | number;
  $cursor?: string;
  $transition?: string;
}

const formatValue = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const StyledButton = styled.button<StyledProps>`
  height: ${({ $height }) => formatValue($height)};
  width: ${({ $width }) => formatValue($width)};
  display: ${({ $display }) => $display || "inline-flex"};
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  align-content: ${({ $alignContent }) => $alignContent};
  gap: ${({ $gap }) => formatValue($gap)};
  overflow: ${({ $overflow }) => $overflow};
  overflow-x: ${({ $overflowX }) => $overflowX};
  overflow-y: ${({ $overflowY }) => $overflowY};
  position: ${({ $position }) => $position};
  margin: ${({ $margin }) => formatValue($margin)};
  padding: ${({ $padding }) => formatValue($padding)};
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || "transparent"};
  color: ${({ $color }) => $color || "inherit"};
  border: ${({ $border }) => $border || "none"};
  border-radius: ${({ $borderRadius }) => formatValue($borderRadius)};
  flex-shrink: ${({ $flexShrink }) => $flexShrink};
  min-height: ${({ $minHeight }) => formatValue($minHeight)};
  min-width: ${({ $minWidth }) => formatValue($minWidth)};
  flex: ${({ $flex }) => $flex};
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  cursor: ${({ $cursor, disabled }) =>
    disabled ? "not-allowed" : $cursor || "pointer"};
  transition: ${({ $transition }) => $transition || "all 0.2s ease"};
  outline: none;
  font-family: inherit;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      height,
      width,
      display,
      flexDirection,
      justifyContent,
      alignItems,
      alignContent,
      gap,
      overflow,
      overflowX,
      overflowY,
      position,
      margin,
      padding,
      backgroundColor,
      color,
      border,
      borderRadius,
      flexShrink,
      minHeight,
      minWidth,
      flex,
      fontSize,
      fontWeight,
      cursor,
      transition,
      type = "button",
      style,
      onClick,
      onMouseEnter,
      onMouseLeave,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
        type={type}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        $height={height}
        $width={width}
        $display={display}
        $flexDirection={flexDirection}
        $justifyContent={justifyContent}
        $alignItems={alignItems}
        $alignContent={alignContent}
        $gap={gap}
        $overflow={overflow}
        $overflowX={overflowX}
        $overflowY={overflowY}
        $position={position}
        $margin={margin}
        $padding={padding}
        $backgroundColor={backgroundColor}
        $color={color}
        $border={border}
        $borderRadius={borderRadius}
        $flexShrink={flexShrink}
        $minHeight={minHeight}
        $minWidth={minWidth}
        $flex={flex}
        $fontSize={fontSize}
        $fontWeight={fontWeight}
        $cursor={cursor}
        $transition={transition}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";

export default Button;
