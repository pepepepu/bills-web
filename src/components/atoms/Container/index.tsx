import React, { forwardRef } from "react";
import styled from "styled-components";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
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
  flexShrink?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  flex?: number | string;
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
  $flexShrink?: number | string;
  $minHeight?: number | string;
  $minWidth?: number | string;
  $flex?: number | string;
}

const formatValue = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const StyledDiv = styled.div<StyledProps>`
  height: ${({ $height }) => formatValue($height)};
  width: ${({ $width }) => formatValue($width)};
  display: ${({ $display }) => $display};
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  justify-content: ${({ $justifyContent }) => $justifyContent};
  align-items: ${({ $alignItems }) => $alignItems};
  align-content: ${({ $alignContent }) => $alignContent};
  gap: ${({ $gap }) => formatValue($gap)};
  overflow: ${({ $overflow }) => $overflow};
  overflow-x: ${({ $overflowX }) => $overflowX};
  overflow-y: ${({ $overflowY }) => $overflowY};
  position: ${({ $position }) => $position};
  margin: ${({ $margin }) => formatValue($margin)};
  padding: ${({ $padding }) => formatValue($padding)};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $color }) => $color};
  border: ${({ $border }) => $border};
  flex-shrink: ${({ $flexShrink }) => $flexShrink};
  min-height: ${({ $minHeight }) => formatValue($minHeight)};
  min-width: ${({ $minWidth }) => formatValue($minWidth)};
  flex: ${({ $flex }) => $flex};
`;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
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
      flexShrink,
      minHeight,
      minWidth,
      flex,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <StyledDiv
        ref={ref}
        style={style}
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
        $flexShrink={flexShrink}
        $minHeight={minHeight}
        $minWidth={minWidth}
        $flex={flex}
        {...rest}
      >
        {children}
      </StyledDiv>
    );
  },
);

Container.displayName = "Container";

export default Container;
