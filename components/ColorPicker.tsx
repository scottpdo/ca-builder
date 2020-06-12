import styled from "styled-components";
import { CompactPicker } from "react-color";
import { Pixel } from "../types/Pixel";
import pixelToHex from "../utils/pixelToHex";

const ColorPicker = styled.div`
  background: #fff;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
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

type ColorChange = (color: {
  rgb: { r: number; g: number; b: number };
}) => void;

export default ({
  color,
  colors,
  onChange,
  style,
}: {
  color?: Pixel;
  colors?: Pixel[];
  onChange: ColorChange;
  style?: React.CSSProperties;
}) => {
  const props: {
    color?: Pixel;
    colors?: string[];
    onChangeComplete: ColorChange;
  } = {
    color,
    onChangeComplete: onChange,
  };
  if (colors) props.colors = colors.map(pixelToHex);
  return (
    <ColorPicker style={style}>
      <CompactPicker {...props} />
    </ColorPicker>
  );
};
