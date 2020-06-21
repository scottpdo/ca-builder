import React from "react";
import styled from "styled-components";
import { Refresh, Pause, Play, Next } from "@styled-icons/foundation";

const StyledControls = styled.div<{ width: number }>`
  background: #eee;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  border: 1px solid #bbb;
  border-top: 0 none;
  padding: 10px;
  width: ${(props) => props.width}px;
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
      <input
        type="range"
        defaultValue={-speed}
        min={-500}
        max={0}
        onChange={(e) => {
          setSpeed(-+e.currentTarget.value);
        }}
      />
    </StyledControls>
  );
};
