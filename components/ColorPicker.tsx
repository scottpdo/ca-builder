import styled, { css } from "styled-components";
import { Colors } from "flocc";
import { Pixel } from "../types/Pixel";
import Swatch from "./styled/Swatch";
import SwatchButton from "./styled/SwatchButton";
import pixelToRGBA from "../utils/pixelToRGBA";
import RAINBOW from "../utils/RAINBOW";

interface StyledColorPickerProps {
  position: "top" | "left" | "right" | "bottom";
  withDelete: boolean;
}

const topCSS = css`
  bottom: 50px;
  left: 50%;

  &:after {
    border-left: 0px solid transparent;
    border-top: 0px solid transparent;
    bottom: -6px;
  }
`;

const bottomCSS = css`
  top: 50px;
  left: 50%;

  &:after {
    border-right: 0px solid transparent;
    border-bottom: 0px solid transparent;
    top: -6px;
  }
`;

export const StyledColorPicker = styled.div<StyledColorPickerProps>`
  background: #fff;
  border: 1px solid #999;
  box-shadow: 0 1px 2px #999;
  transform: translateX(-50%);
  padding: 5px;
  position: absolute;
  width: 112px;
  z-index: 2;

  &:after {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    content: "";
    left: calc(50% - 5px);
    transform: rotate(45deg);
    border: 1px solid #999;
  }

  ${(props) => props.position === "top" && topCSS}
  ${(props) => props.position === "bottom" && bottomCSS}
`;

const ColorPickerInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

type ColorChange = (p: Pixel | "wild") => void;

export default ({
  colors,
  onChange,
  position,
  style,
  wild,
  withDelete,
}: {
  colors?: Pixel[];
  onChange: ColorChange;
  position?: "top" | "left" | "right" | "bottom";
  style?: React.CSSProperties;
  wild?: boolean;
  withDelete?: boolean;
}) => {
  if (!colors) colors = Object.values(Colors);
  if (!position) position = "top";
  return (
    <StyledColorPicker
      style={style}
      withDelete={withDelete}
      position={position}
    >
      <ColorPickerInner>
        {colors.map((color, i) => {
          return (
            <Swatch
              key={i}
              style={{
                background: pixelToRGBA(color),
                width: 15,
                height: 15,
                margin: 5,
              }}
            >
              <SwatchButton onClick={() => onChange(color)} />
            </Swatch>
          );
        })}
        {wild && (
          <Swatch
            style={{
              background: RAINBOW,
              width: 15,
              height: 15,
              margin: 5,
            }}
          >
            <SwatchButton onClick={() => onChange("wild")} />
          </Swatch>
        )}
      </ColorPickerInner>
    </StyledColorPicker>
  );
};
