import styled from "styled-components";

export default styled.div`
  background: #fff;
  border: 1px solid #999;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  padding: 20px;
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
