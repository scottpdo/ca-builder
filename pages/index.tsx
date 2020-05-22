import { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import {
  Environment,
  CanvasRenderer,
  Terrain,
  Colors,
  utils,
  LineChartRenderer,
  KDTree,
} from "flocc";

const run = (environment: Environment) => {
  environment.tick();
  window.requestAnimationFrame(() => run(environment));
};

interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

const isPixel = (p: any): p is Pixel => {
  return (
    typeof p === "object" &&
    p.hasOwnProperty("r") &&
    p.hasOwnProperty("g") &&
    p.hasOwnProperty("b") &&
    p.hasOwnProperty("a")
  );
};

const match = (p1: Pixel, p2: Pixel): boolean => {
  return p1.r === p2.r && p1.g === p2.g && p1.b === p2.b && p1.a === p2.a;
};

export default () => {
  useEffect(() => {
    const [width, height] = [600, 600];
    const environment = new Environment({ width, height });
    const renderer = new CanvasRenderer(environment, {
      width,
      height,
    });
    renderer.mount("#canvas");
    const terrain = new Terrain(width / 2, height / 2, {
      async: false,
      grayscale: false,
      scale: 2,
    });
    terrain.init((x, y) => {
      return utils.sample([Colors.BLACK, Colors.WHITE]);
    });
    terrain.addRule((x: number, y: number) => {
      const left = terrain.sample(x - 1, y);
      const right = terrain.sample(x + 1, y);
      const here = terrain.sample(x, y);
      if (!isPixel(left)) return here;
      if (!isPixel(right)) return here;
      if (!isPixel(here)) return here;
      if (match(left, right) && !match(left, here)) {
        return left;
      }
      return Math.random() > 0.03
        ? here
        : terrain.sample(x, y + utils.sample([1, -1]));
    });
    environment.use(terrain);
    run(environment);
  }, []);
  return (
    <Wrapper>
      <div id="canvas"></div>
    </Wrapper>
  );
};
