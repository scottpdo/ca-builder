import styled from "styled-components";
import { CompactPicker } from "react-color";
import { Pixel } from "../types/Pixel";

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

export default ({
  color,
  onChange,
}: {
  color: Pixel;
  onChange: (color: { rgb: { r: number; g: number; b: number } }) => void;
}) => {
  return (
    <ColorPicker>
      <CompactPicker color={color} onChangeComplete={onChange} />
    </ColorPicker>
  );
};
