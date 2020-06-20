import React from "react";
import styled from "styled-components";
import { Refresh, Pause, Play, Next } from "@styled-icons/foundation";

const StyledControls = styled.div`
  display: flex;
`;

export default ({
  isPlaying,
  refresh,
  setIsPlaying,
  setSpeed,
  speed,
  tick,
}: {
  isPlaying: boolean;
  refresh: () => void;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  tick: () => void;
}) => {
  return (
    <StyledControls>
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
