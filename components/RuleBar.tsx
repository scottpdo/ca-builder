import styled from "styled-components";
import { Colors } from "flocc";
import { Rule } from "../types/Rule";
import { match, Pixel } from "../types/Pixel";
import { X, ArrowRight } from "@styled-icons/foundation";
import pixelToRGBA from "../utils/pixelToRGBA";
import Delete from "./Delete";
import { useState } from "react";
import ColorPicker from "./ColorPicker";

const iToX = (i: number): number => {
  return (i < 4 ? i : i + 1) % 3;
};

const iToY = (i: number): number => {
  return ((i < 4 ? i : i + 1) / 3) | 0;
};

const Tile = styled.rect`
  cursor: pointer;
`;

const RuleBar = styled.div`
  background: #fff;
  border: 1px solid #999;
  box-shadow: 0 1px 2px 0 #999;
  border-radius: 3px;
  align-items: center;
  display: flex;
  width: 300px;
  justify-content: space-between;
  margin: 0 20px 20px 0;
  padding: 10px;

  span {
    font-size: 32px;
  }

  &:hover {
    ${Delete} {
      display: block;
    }
  }
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
  rule: Rule;
  update: (r: Rule) => void;
}) => {
  const [isPicking, setIsPicking] = useState<number | "self" | "output">(-1);
  return (
    <RuleBar>
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
              bottom: 15,
              left: 0,
              transform: "translateX(0)",
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
    </RuleBar>
  );
};
