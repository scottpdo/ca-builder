import styled from "styled-components";
import Delete from "./Delete";

export default styled.div`
  box-shadow: 0 0 2px #666;
  height: 40px;
  width: 40px;

  &:hover ${Delete} {
    display: block;
  }
`;
