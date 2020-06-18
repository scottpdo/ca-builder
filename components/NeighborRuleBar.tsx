import styled from "styled-components";
import { NeighborRule } from "../types/Rule";
import { match, Pixel } from "../types/Pixel";
import { X, ArrowRight } from "@styled-icons/foundation";
import pixelToRGBA from "../utils/pixelToRGBA";
import { useState, SyntheticEvent } from "react";
import ColorPicker from "./ColorPicker";
import Delete from "./styled/Delete";
import StyledRuleBar from "./styled/StyledRuleBar";

const iToX = (i: number): number => {
  return (i < 4 ? i : i + 1) % 3;
};

const iToY = (i: number): number => {
  return ((i < 4 ? i : i + 1) / 3) | 0;
};

const Tile = styled.rect`
  cursor: pointer;
`;

const ShadowSVG = styled.svg`
  box-shadow: 0 0 2px #666;
`;

const size = 30;

export default ({
  deleteRule,
  palette,
  rule,
  update,
}: {
  deleteRule: () => void;
  palette: Pixel[];
  rule: NeighborRule;
  update: (r: NeighborRule) => void;
}) => {
  const [cursor, setCursor] = useState<{ x: Number; y: number }>({
    x: -1,
    y: -1,
  });
  const [isPicking, setIsPicking] = useState<number | "self" | "output">(-1);
  const onClick = (e: SyntheticEvent<HTMLDivElement, MouseEvent>): void => {
    const bb =
      e.target instanceof Element ? e.target.getBoundingClientRect() : null;
    if (!bb) return;
    setCursor({
      x: Math.round(bb.x + bb.width / 2),
      y: Math.round(bb.y + bb.height / 2),
    });
  };
  return (
    <StyledRuleBar onClick={onClick}>
      <div>
        <ShadowSVG height={size * 3} width={size * 3}>
          {rule.input.map((n, i) => (
            <g key={i}>
              <Tile
                fill={pixelToRGBA(palette[n])}
                x={iToX(i) * size}
                y={iToY(i) * size}
                width={size}
                height={size}
                onClick={() => setIsPicking(isPicking === i ? -1 : i)}
              />
              {i === 3 && (
                <Tile
                  fill={pixelToRGBA(palette[rule.self])}
                  x={size}
                  y={size}
                  width={size}
                  height={size}
                  onClick={() => {
                    setIsPicking(isPicking === "self" ? -1 : "self");
                    // const color = match(rule.self, Colors.BLACK)
                    //   ? Colors.WHITE
                    //   : Colors.BLACK;
                    // rule.self = color;
                    // update(rule);
                  }}
                />
              )}
            </g>
          ))}
        </ShadowSVG>
        {(typeof isPicking === "number" && isPicking >= 0) ||
        isPicking === "self" ? (
          <ColorPicker
            color={
              palette[
                typeof isPicking === "number"
                  ? rule.input[isPicking]
                  : rule.self
              ]
            }
            colors={palette}
            onChange={(color) => {
              const { r, g, b } = color.rgb;
              const p = palette.findIndex((_p) => {
                return match(_p, { r, g, b, a: 255 });
              });
              rule.input[isPicking] = p;
              update(rule);
              setIsPicking(-1);
            }}
            style={{
              bottom: +cursor.x,
              left: +cursor.y,
              // transform: "translateX(0)",
            }}
          />
        ) : null}
      </div>
      <ArrowRight width={24} />
      <ShadowSVG height={size} width={size}>
        <Tile
          fill={pixelToRGBA(palette[rule.output])}
          x={0}
          y={0}
          width={size}
          height={size}
          onClick={() => {
            setIsPicking(isPicking === "output" ? -1 : "output");
            // const color = match(rule.output, Colors.BLACK)
            //   ? Colors.WHITE
            //   : Colors.BLACK;
            // rule.output = color;
            // update(rule);
          }}
        />
      </ShadowSVG>
      <Delete onClick={deleteRule}>
        <X width={12} />
      </Delete>
    </StyledRuleBar>
  );
};
