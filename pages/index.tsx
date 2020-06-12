import { useState, useEffect } from "react";
import { Refresh, Plus } from "@styled-icons/foundation";
import Wrapper from "../components/Wrapper";
import RuleBar from "../components/RuleBar";
import { Environment, CanvasRenderer, Terrain, Colors, utils } from "flocc";
import { Pixel, isPixel, match } from "../types/Pixel";
import { Rule } from "../types/Rule";
import CanvasContainer from "../components/CanvasContainer";
import RuleContainer from "../components/RuleContainer";
import Palette from "../components/Palette";

const run = (environment: Environment) => {
  environment.tick();
  animationFrame = window.requestAnimationFrame(() => run(environment));
};

let environment: Environment;
let renderer: CanvasRenderer;
let terrain: Terrain;
let animationFrame: number;

export default () => {
  const [palette, setPalette] = useState<Pixel[]>([Colors.BLACK, Colors.WHITE]);
  const [refresh, setRefresh] = useState<number>(0);
  const [rules, setRules] = useState<Rule[]>([
    {
      input: [1, 0, 1, 0, 0, 1, 0, 1],
      self: 1,
      output: 0,
    },
    {
      input: [0, 1, 0, 1, 1, 0, 1, 0],
      self: 0,
      output: 1,
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
    terrain.init((x, y) => utils.sample(palette));
    terrain.addRule((x, y) => {
      const here = terrain.sample(x, y);
      if (!isPixel(here)) return;
      const neighbors = terrain.neighbors(x, y);
      for (let rule of rules) {
        const passes =
          neighbors.every((neighbor, i) => {
            return isPixel(neighbor) && match(neighbor, palette[rule.input[i]]);
          }) && match(here, palette[rule.self]);
        if (passes) return palette[rule.output];
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
  }, [palette, rules, refresh]);
  return (
    <Wrapper>
      <RuleContainer>
        <h2>Rules</h2>
        {rules.map((rule, i) => (
          <RuleBar
            deleteRule={() => setRules(rules.filter((_rule) => rule !== _rule))}
            key={i}
            palette={palette}
            rule={rule}
            update={(r) =>
              setRules(rules.map((_rule) => (_rule === rule ? r : _rule)))
            }
          />
        ))}
        <Plus
          style={{ cursor: "pointer" }}
          width={26}
          onClick={() =>
            setRules(
              rules.concat({
                input: new Array(8).fill(1),
                self: 0,
                output: 1,
              })
            )
          }
        />
      </RuleContainer>
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
          <div id="canvas"></div>
          <Refresh
            style={{ cursor: "pointer" }}
            onClick={() => setRefresh(refresh + 1)}
            width={28}
          />
        </div>
        <Palette
          palette={palette}
          setPalette={setPalette}
          setRefresh={() => setRefresh(refresh + 1)}
        />
      </CanvasContainer>
    </Wrapper>
  );
};
