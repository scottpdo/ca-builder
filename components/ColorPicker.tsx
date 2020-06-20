import styled, { css } from "styled-components";
import { Colors } from "flocc";
import { Pixel } from "../types/Pixel";
import Swatch from "./styled/Swatch";
import SwatchButton from "./styled/SwatchButton";
import pixelToRGBA from "../utils/pixelToRGBA";
import RAINBOW from "../utils/RAINBOW";

export const StyledColorPicker = styled.div<{ withDelete: boolean }>`
  background: #fff;
  bottom: 50px;
  border: 1px solid #999;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  position: absolute;
  width: 112px;
  z-index: 2;

  &:after {
    position: absolute;
    bottom: -6px;
    width: 10px;
    height: 10px;
    background: #fff;
    content: "";
    left: calc(50% - 5px);
    transform: rotate(45deg);
    border-right: 1px solid #999;
    border-bottom: 1px solid #999;
  }
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
  style,
  wild,
  withDelete,
}: {
  colors?: Pixel[];
  onChange: ColorChange;
  style?: React.CSSProperties;
  wild?: boolean;
  withDelete?: boolean;
}) => {
  if (!colors) colors = Object.values(Colors);
  return (
    <StyledColorPicker style={style} withDelete={withDelete}>
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
