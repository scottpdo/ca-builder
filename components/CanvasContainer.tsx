import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: fixed;
  top: 30px;
  right: 30px;
  height: calc(100vh - 60px);
  width: calc(100vw - 390px);

  canvas {
    box-shadow: 0 0 6px #666;
    margin-bottom: 10px;
  }
`;
