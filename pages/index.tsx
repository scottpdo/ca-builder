import { useState, useEffect } from "react";
import { Refresh, Plus } from "@styled-icons/foundation";
import Wrapper from "../components/Wrapper";
import NeighborRuleBar from "../components/NeighborRuleBar";
import ThresholdRuleBar from "../components/ThresholdRuleBar";
import { Environment, CanvasRenderer, Terrain, Colors, utils } from "flocc";
import { Pixel, isPixel, match } from "../types/Pixel";
import {
  Rule,
  NeighborRule,
  ThresholdRule,
  Comparators,
  AllOrAny,
} from "../types/Rule";
import CanvasContainer from "../components/CanvasContainer";
import RuleContainer from "../components/RuleContainer";
import Palette from "../components/Palette";
import Controls from "../components/Controls";

const [width, height] = [500, 300];

let environment: Environment;
let renderer: CanvasRenderer;
let terrain: Terrain;
let timeout: number;

const updateTerrainRule = (
  terrain: Terrain,
  rules: Rule[],
  palette: Pixel[]
) => {
  terrain.rule = null;
  terrain.addRule((x, y) => {
    const here = terrain.sample(x, y);
    if (!isPixel(here)) return;
    const neighbors = terrain.neighbors(x, y, 1, true);
    for (let rule of rules) {
      const matchesHere =
        rule.self === -1 ? true : match(here, palette[rule.self]);
      if (!matchesHere) continue;

      if (rule instanceof NeighborRule) {
        const passes =
          neighbors.every((neighbor, i) => {
            return (
              isPixel(neighbor) &&
              rule instanceof NeighborRule &&
              match(neighbor, palette[rule.input[i]])
            );
          }) && matchesHere;
        if (passes) return palette[rule.output];
      } else if (rule instanceof ThresholdRule) {
        const method = rule.match === AllOrAny.ALL ? "every" : "some";
        const passes = rule.thresholds[method]((arr) => {
          const [colorIndex, comparator, threshold] = arr;
          if (!(rule instanceof ThresholdRule)) return false;
          const color = palette[colorIndex];
          const matchingNeighbors = neighbors.filter(
            (neighbor) => isPixel(neighbor) && match(neighbor, color)
          ).length;
          switch (comparator) {
            case Comparators.EQ:
              return matchingNeighbors === threshold;
            case Comparators.LT:
              return matchingNeighbors < threshold;
            case Comparators.GT:
              return matchingNeighbors > threshold;
            case Comparators.LTE:
              return matchingNeighbors <= threshold;
            case Comparators.GTE:
              return matchingNeighbors >= threshold;
            default:
              return false;
          }
        });
        if (passes) return palette[rule.output];
      }
    }
    return here;
  });
};

export default () => {
  const [distribution, setDistribution] = useState<number[]>([0.5, 0.5]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [palette, setPalette] = useState<Pixel[]>([Colors.BLACK, Colors.WHITE]);
  const [refresh, setRefresh] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(100);
  const [tick, setTick] = useState<number>(0);

  const run = (environment: Environment) => {
    window.clearTimeout(timeout);
    environment.tick();
    if (isPlaying) {
      timeout = window.setTimeout(() => run(environment), speed);
    }
  };

  const alive: [number, Comparators, number][] = [[1, Comparators.EQ, 3]];
  const dead: [number, Comparators, number][] = [
    [1, Comparators.LT, 2],
    [1, Comparators.GT, 3],
  ];
  const [rules, setRules] = useState<Rule[]>([
    new ThresholdRule({
      thresholds: alive,
      self: -1,
      output: 1,
    }),
    new ThresholdRule({
      thresholds: dead,
      self: 1,
      output: 0,
    }),
  ]);
  useEffect(() => {
    environment = new Environment({ width, height });
    renderer = new CanvasRenderer(environment, {
      width,
      height,
    });
    renderer.mount("#canvas");
    terrain = new Terrain(width / 4, height / 4, {
      async: false,
      grayscale: false,
      scale: 4,
    });
    terrain.init((x, y) => utils.sample(palette, distribution));
    updateTerrainRule(terrain, rules, palette);
    environment.use(terrain);
    environment.renderers[0].render();
    if (isPlaying) run(environment);
    return () => {
      environment = null;
      renderer = null;
      terrain = null;
      window.clearTimeout(timeout);
    };
  }, [refresh]);

  useEffect(() => {
    const removeRule = (rule: Rule) => {
      setRules(rules.filter((_rule) => _rule !== rule));
    };
    rules.forEach((rule) => {
      if (rule.self >= palette.length || rule.output >= palette.length) {
        removeRule(rule);
      }
      if (rule instanceof ThresholdRule) {
        rule.thresholds.forEach(([colorIndex]) => {
          if (colorIndex >= palette.length) removeRule(rule);
        });
      }
    });
    updateTerrainRule(terrain, rules, palette);
  }, [palette]);

  useEffect(() => {
    updateTerrainRule(terrain, rules, palette);
  }, [rules]);

  useEffect(() => {
    // if environment.time === 1, that's because only the above
    // useEffect ran -- so wait until isPlaying or tick actually changes
    if (environment.time > 1) run(environment);
  }, [isPlaying, tick]);

  useEffect(() => {
    if (environment.time === 1 || !isPlaying) return;

    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => run(environment), speed);
  }, [speed]);
  return (
    <Wrapper>
      <RuleContainer>
        <Palette
          distribution={distribution}
          palette={palette}
          setPalette={setPalette}
          setDistribution={setDistribution}
        />
        {/* <h2>Rules</h2> */}
        {rules.map((rule, i) => {
          return rule instanceof NeighborRule ? (
            <NeighborRuleBar
              deleteRule={(rule) => {
                setRules(rules.filter((_rule) => rule !== _rule));
                setRefresh(refresh + 1);
              }}
              key={i}
              palette={palette}
              rule={rule}
              update={(r) =>
                setRules(rules.map((_rule) => (_rule === rule ? r : _rule)))
              }
            />
          ) : rule instanceof ThresholdRule ? (
            <ThresholdRuleBar
              deleteRule={(rule) => {
                setRules(rules.filter((_rule) => rule !== _rule));
              }}
              key={i}
              palette={palette}
              rule={rule}
              update={(r) =>
                setRules(rules.map((_rule) => (_rule === rule ? r : _rule)))
              }
            />
          ) : null;
        })}
        <Plus
          style={{ cursor: "pointer" }}
          width={26}
          onClick={() => {
            const thresholds: [number, Comparators, number][] = [
              [0, Comparators.EQ, 0],
            ];
            setRules(
              rules.concat(
                new ThresholdRule({
                  thresholds,
                  self: -1,
                  output: 0,
                })
              )
            );
          }}
        />
      </RuleContainer>
      <div style={{ width: "100%" }}>
        <CanvasContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div id="canvas" style={{ width, height }}></div>
            <Controls
              distribution={distribution}
              palette={palette}
              isPlaying={isPlaying}
              refresh={() => setRefresh(refresh + 1)}
              setDistribution={setDistribution}
              setIsPlaying={setIsPlaying}
              setSpeed={setSpeed}
              speed={speed}
              tick={() => setTick(tick + 1)}
              width={width}
            />
          </div>
        </CanvasContainer>
      </div>
    </Wrapper>
  );
};
