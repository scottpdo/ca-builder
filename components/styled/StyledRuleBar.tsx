import styled from "styled-components";
import Delete from "./Delete";

export default styled.div`
  background: #fff;
  border: 1px solid #999;
  box-shadow: 0 1px 2px 0 #999;
  border-radius: 3px;
  align-items: center;
  display: flex;
  width: 360px;
  justify-content: space-between;
  margin: 0 20px 20px 0;
  padding: 10px;

  &:hover {
    ${Delete} {
      display: block;
    }
  }
`;
