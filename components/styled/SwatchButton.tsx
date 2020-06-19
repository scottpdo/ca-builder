import styled from "styled-components";
import Delete from "./Delete";

export default styled.button`
  appearance: none;
  background: transparent;
  border: 0 none;
  border-radius: 0;
  cursor: pointer;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  &:focus + ${Delete} {
    display: block;
  }
`;
