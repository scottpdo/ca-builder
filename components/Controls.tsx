import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Refresh,
  Pause,
  Play,
  Next,
  Plus,
  Minus,
} from "@styled-icons/foundation";
import pixelToRGBA from "../utils/pixelToRGBA";
import { Pixel } from "../types/Pixel";
import { utils } from "flocc";

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

const Distribution = styled.div`
  height: 20px;

  span {
    background: #eee;
    border: 1px solid #999;
    cursor: col-resize;
    display: block;
    position: absolute;
    top: -4px;
    height: 28px;
    right: -3px;
    width: 7px;
    z-index: 2;
  }
`;

export default ({
  distribution,
  isPlaying,
  palette,
  refresh,
  setDistribution,
  setIsPlaying,
  setSpeed,
  speed,
  tick,
  width,
}: {
  distribution: number[];
  isPlaying: boolean;
  palette: Pixel[];
  refresh: () => void;
  setDistribution: React.Dispatch<React.SetStateAction<number[]>>;
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
      {/* <div style={{ border: "1px solid #999", display: "flex" }}>
        {palette.map((p, i) => {
          return (
            <Distribution
              style={{
                width: distribution[i] * 100 + "%",
                background: pixelToRGBA(p),
              }}
              key={i}
            >
              <Minus width={14} />
              <Plus width={14} />
            </Distribution>
          );
        })}
      </div> */}
    </StyledControls>
  );
};
