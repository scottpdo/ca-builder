import styled from "styled-components";
import { Colors } from "flocc";
import { CompactPicker } from "react-color";
import { Pixel } from "../types/Pixel";
import pixelToHex from "../utils/pixelToHex";
import Swatch from "./styled/Swatch";
import SwatchButton from "./styled/SwatchButton";
import pixelToRGBA from "../utils/pixelToRGBA";
import RAINBOW from "../utils/RAINBOW";

const ColorPicker = styled.div`
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
}: {
  colors?: Pixel[];
  onChange: ColorChange;
  style?: React.CSSProperties;
  wild?: boolean;
}) => {
  if (!colors) colors = Object.values(Colors);
  return (
    <ColorPicker style={style}>
      <ColorPickerInner>
        {colors.map((color) => {
          return (
            <Swatch
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
    </ColorPicker>
  );
};
