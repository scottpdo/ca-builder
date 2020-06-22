import React from "react";
import styled from "styled-components";
import { Refresh, Pause, Play, Next } from "@styled-icons/foundation";

const StyledControls = styled.div<{ width: number }>`
  background: #fff;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  border: 1px solid #bbb;
  border-top: 0 none;
  box-shadow: 0 1px 2px 0 #999;
  padding: 10px;
  width: ${(props) => props.width}px;
`;

const SpeedContainer = styled.div`
  padding-bottom: 10px;
  width: 150px;

  input {
    width: 100%;
  }

  label {
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    bottom: 0;
    left: 3px;

    &:last-child {
      left: unset;
      right: 0;
    }
  }
`;

export default ({
  isPlaying,
  refresh,
  setIsPlaying,
  setSpeed,
  speed,
  tick,
  width,
}: {
  isPlaying: boolean;
  refresh: () => void;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  tick: () => void;
  width: number;
}) => {
  return (
    <StyledControls width={width}>
      <div>
        <Refresh style={{ cursor: "pointer" }} onClick={refresh} width={28} />
        {isPlaying && (
          <Pause
            width={28}
            onClick={() => {
              setIsPlaying(false);
            }}
          />
        )}
        {!isPlaying && (
          <>
            <Play
              width={28}
              onClick={() => {
                setIsPlaying(true);
              }}
            />
            <Next width={28} onClick={tick} />
          </>
        )}
      </div>
      <SpeedContainer>
        <input
          type="range"
          value={-speed}
          min={-500}
          max={0}
          onChange={(e) => {
            setSpeed(-+e.currentTarget.value);
          }}
        />
        <label onClick={() => setSpeed(500)}>Slow</label>
        <label onClick={() => setSpeed(0)}>Fast</label>
      </SpeedContainer>
    </StyledControls>
  );
};
