import styled from "styled-components";
import { Colors } from "flocc";
import { Rule } from "../types/Rule";
import { match } from "../types/Pixel";
import { X } from "@styled-icons/foundation";
import pixelToRGBA from "../utils/pixelToRGBA";

const iToX = (i: number): number => {
  return (i < 4 ? i : i + 1) % 3;
};

const iToY = (i: number): number => {
  return ((i < 4 ? i : i + 1) / 3) | 0;
};

const Tile = styled.rect`
  cursor: pointer;
`;

const Delete = styled.button`
  appearance: none;
  border: 0 none;
  background: #fff;
  box-shadow: 0 1px 2px #999;
  color: #999;
  cursor: pointer;
  border-radius: 50%;
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(50%) translateY(-50%);
  height: 20px;
  text-align: center;
  width: 20px;
  padding: 0;
  font-size: 14px;
`;

const RuleBar = styled.div`
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

const size = 30;

export default ({
  deleteRule,
  rule,
  update,
}: {
  deleteRule: () => void;
  rule: Rule;
  update: (r: Rule) => void;
}) => {
  return (
    <RuleBar>
      <svg height={size * 3} width={size * 3}>
        {rule.input.map((p, i) => (
          <g key={i}>
            <Tile
              fill={pixelToRGBA(p)}
              x={iToX(i) * size}
              y={iToY(i) * size}
              width={size}
              height={size}
              onClick={() => {
                const color = match(p, Colors.BLACK)
                  ? Colors.WHITE
                  : Colors.BLACK;
                rule.input[i] = color;
                update(rule);
              }}
            />
            {i === 3 && (
              <Tile
                fill={pixelToRGBA(rule.self)}
                x={size}
                y={size}
                width={size}
                height={size}
                onClick={() => {
                  const color = match(rule.self, Colors.BLACK)
                    ? Colors.WHITE
                    : Colors.BLACK;
                  rule.self = color;
                  update(rule);
                }}
              />
            )}
          </g>
        ))}
      </svg>
      <span>&rarr;</span>
      <svg height={size} width={size}>
        <Tile
          fill={pixelToRGBA(rule.output)}
          x={0}
          y={0}
          width={size}
          height={size}
          onClick={() => {
            const color = match(rule.output, Colors.BLACK)
              ? Colors.WHITE
              : Colors.BLACK;
            rule.output = color;
            update(rule);
          }}
        />
      </svg>
      <Delete onClick={deleteRule}>
        <X width={12} />
      </Delete>
    </RuleBar>
  );
};
