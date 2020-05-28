import { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import RuleBar from "../components/RuleBar";
import {
  Environment,
  CanvasRenderer,
  Terrain,
  Colors,
  utils,
  LineChartRenderer,
  KDTree,
} from "flocc";
import { Pixel, isPixel, match } from "../types/Pixel";
import { Rule } from "../types/Rule";

const run = (environment: Environment) => {
  environment.tick();
  animationFrame = window.requestAnimationFrame(() => run(environment));
};

let environment: Environment;
let renderer: CanvasRenderer;
let terrain: Terrain;
let animationFrame: number;

const { BLACK, WHITE } = Colors;

export default () => {
  const [rules, setRules] = useState<Rule[]>([
    {
      input: [BLACK, WHITE, BLACK, WHITE, WHITE, BLACK, WHITE, BLACK],
      self: BLACK,
      output: WHITE,
    },
    {
      input: [WHITE, BLACK, WHITE, BLACK, BLACK, WHITE, BLACK, WHITE],
      self: WHITE,
      output: BLACK,
    },
  ]);
  useEffect(() => {
    const [width, height] = [300, 300];
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
    terrain.init((x, y) => {
      return utils.sample([Colors.BLACK, Colors.WHITE]);
    });
    terrain.addRule((x, y) => {
      const here = terrain.sample(x, y);
      if (!isPixel(here)) return;
      const neighbors = terrain.neighbors(x, y);
      for (let rule of rules) {
        const passes =
          neighbors.every((neighbor, i) => {
            return isPixel(neighbor) && match(neighbor, rule.input[i]);
          }) && match(here, rule.self);
        if (passes) return rule.output;
      }
      return here;
    });
    environment.use(terrain);
    run(environment);
    return () => {
      environment = null;
      renderer = null;
      terrain = null;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [rules]);
  return (
    <Wrapper>
      <div>
        {rules.map((rule, i) => (
          <RuleBar
            key={i}
            rule={rule}
            update={(r) =>
              setRules(rules.map((_rule) => (_rule === rule ? r : _rule)))
            }
            deleteRule={() => setRules(rules.filter((_rule) => rule !== _rule))}
          />
        ))}
        <button
          onClick={() =>
            setRules(
              rules.concat({
                input: new Array(8).fill(Colors.WHITE),
                self: Colors.BLACK,
                output: Colors.BLACK,
              })
            )
          }
        >
          +
        </button>
      </div>
      <div style={{ padding: 40, position: "fixed", top: 0, right: 0 }}>
        <div id="canvas"></div>
      </div>
    </Wrapper>
  );
};
