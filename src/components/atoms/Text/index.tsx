import React, { forwardRef } from "react";
import styled from "styled-components";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  textStyle?: string;
  textAlign?: string;
  textDecoration?: string;
  margin?: number | string;
  padding?: number | string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  fontColor?: string;
}

interface StyledProps {
  $fontSize?: number | string;
  $fontWeight?: number | string;
  $fontFamily?: string;
  $textStyle?: string;
  $textAlign?: string;
  $textDecoration?: string;
  $margin?: number | string;
  $padding?: number | string;
  $letterSpacing?: number | string;
  $lineHeight?: number | string;
  $fontColor?: string;
}

const formatValue = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const StyledText = styled.span<StyledProps>`
  font-size: ${({ $fontSize }) => formatValue($fontSize)};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  font-family: ${({ $fontFamily }) => $fontFamily};
  font-style: ${({ $textStyle }) => $textStyle};
  text-align: ${({ $textAlign }) => $textAlign};
  text-decoration: ${({ $textDecoration }) => $textDecoration};
  margin: ${({ $margin }) => formatValue($margin)};
  padding: ${({ $padding }) => formatValue($padding)};
  letter-spacing: ${({ $letterSpacing }) => formatValue($letterSpacing)};
  line-height: ${({ $lineHeight }) =>
    typeof $lineHeight === "number" ? $lineHeight : formatValue($lineHeight)};
  color: ${({ $fontColor }) => $fontColor || "inherit"};
`;

const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = "span",
      fontSize,
      fontWeight,
      fontFamily,
      textStyle,
      textAlign,
      textDecoration,
      margin,
      padding,
      letterSpacing,
      lineHeight,
      fontColor,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <StyledText
        as={as}
        ref={ref}
        style={style}
        $fontSize={fontSize}
        $fontWeight={fontWeight}
        $fontFamily={fontFamily}
        $textStyle={textStyle}
        $textAlign={textAlign}
        $textDecoration={textDecoration}
        $margin={margin}
        $padding={padding}
        $letterSpacing={letterSpacing}
        $lineHeight={lineHeight}
        $fontColor={fontColor}
        {...rest}
      >
        {children}
      </StyledText>
    );
  },
);

Text.displayName = "Text";

export default Text;
