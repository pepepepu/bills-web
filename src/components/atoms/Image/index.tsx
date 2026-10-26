import React, { forwardRef } from "react";
import styled from "styled-components";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  margin?: number | string;
  objectFit?: string;
  flex?: number | string;
  position?: string;
}

interface StyledProps {
  $width?: number | string;
  $height?: number | string;
  $padding?: number | string;
  $margin?: number | string;
  $objectFit?: string;
  $flex?: number | string;
  $position?: string;
}

const formatValue = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const StyledImage = styled.img<StyledProps>`
  width: ${({ $width }) => formatValue($width)};
  height: ${({ $height }) => formatValue($height)};
  padding: ${({ $padding }) => formatValue($padding)};
  margin: ${({ $margin }) => formatValue($margin)};
  object-fit: ${({ $objectFit }) => $objectFit};
  flex: ${({ $flex }) => $flex};
  position: ${({ $position }) => $position};
  display: inline-block;
`;

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      width,
      height,
      padding,
      margin,
      objectFit,
      flex,
      position,
      style,
      alt = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <StyledImage
        ref={ref}
        alt={alt}
        style={style}
        $width={width}
        $height={height}
        $padding={padding}
        $margin={margin}
        $objectFit={objectFit}
        $flex={flex}
        $position={position}
        {...rest}
      ></StyledImage>
    );
  },
);

Image.displayName = "Image";

export default Image;
