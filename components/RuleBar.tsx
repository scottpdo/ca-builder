import styled from "styled-components";
import { Colors } from "flocc";
import { Rule } from "../types/Rule";
import { match } from "../types/Pixel";

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
  border: 2px solid #999;
  background: #fff;
  color: #999;
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
  font-size: 16px;
`;

const RuleBar = styled.div`
  align-items: center;
  display: flex;
  width: 300px;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #999;

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
              fill={`rgb(${p.r}, ${p.g}, ${p.b})`}
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
                fill={`rgb(${rule.self.r}, ${rule.self.g}, ${rule.self.b})`}
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
          fill={`rgb(${rule.output.r}, ${rule.output.g}, ${rule.output.b})`}
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
      <Delete onClick={deleteRule}>&times;</Delete>
    </RuleBar>
  );
};
