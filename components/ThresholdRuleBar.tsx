import StyledRuleBar from "./styled/StyledRuleBar";
import { Pixel, match } from "../types/Pixel";
import { ThresholdRule, Comparators, AllOrAny } from "../types/Rule";
import pixelToRGBA from "../utils/pixelToRGBA";
import SwatchButton from "./styled/SwatchButton";
import Swatch from "./styled/Swatch";
import { useState } from "react";
import ColorPicker from "./ColorPicker";
import RAINBOW from "../utils/RAINBOW";

export default ({
  deleteRule,
  palette,
  rule,
  update,
}: {
  deleteRule: () => void;
  palette: Pixel[];
  rule: ThresholdRule;
  update: (r: ThresholdRule) => void;
}) => {
  const { self, output, thresholds } = rule;
  const isWild = self === -1;

  const [isPicking, setIsPicking] = useState<"self" | "output" | number>(null);

  const onChangeComparator = (
    arr: [number, number],
    comparator: Comparators
  ) => {
    thresholds.set(arr, comparator);
    update(rule);
  };

  const onChangeThreshold = (
    arr: [number, number],
    threshold: number,
    comparator: Comparators
  ) => {
    arr[1] = threshold;
    thresholds.set(arr, comparator);
    update(rule);
  };

  return (
    <StyledRuleBar>
      <Swatch>
        <SwatchButton
          onClick={() => setIsPicking(isPicking === "self" ? null : "self")}
          style={{
            background: isWild ? RAINBOW : pixelToRGBA(palette[self]),
          }}
        />
        {isPicking === "self" && (
          <ColorPicker
            colors={palette}
            onChange={(color) => {
              const colorIndex =
                color === "wild"
                  ? -1
                  : palette.findIndex((p) => match(color, p));
              rule.self = colorIndex;
              update(rule);
              setIsPicking(null);
            }}
            wild
          />
        )}
      </Swatch>
      <div>
        {thresholds.size > 1 && (
          <label>
            Match:{" "}
            <select
              defaultValue={rule.match}
              onChange={(e) => {
                // @ts-ignore
                const value: AllOrAny = e.currentTarget.value;
                rule.match = value;
                update(rule);
              }}
            >
              <option>{AllOrAny.ALL}</option>
              <option>{AllOrAny.ANY}</option>
            </select>
          </label>
        )}
        {Array.from(thresholds.keys()).map((arr, i) => {
          const [colorIndex, threshold] = arr;
          const comparator = thresholds.get(arr);
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Swatch>
                <SwatchButton
                  onClick={() => setIsPicking(isPicking === i ? null : i)}
                  style={{ background: pixelToRGBA(palette[colorIndex]) }}
                />
                {isPicking === i && (
                  <ColorPicker
                    colors={palette}
                    onChange={(color) => {
                      if (color === "wild") return;
                      const newColorIndex = palette.findIndex((p) =>
                        match(color, p)
                      );
                      arr[0] = newColorIndex;
                      update(rule);
                      setIsPicking(null);
                    }}
                  />
                )}
              </Swatch>
              <select
                defaultValue={comparator}
                // @ts-ignore
                onChange={(e) => onChangeComparator(arr, e.currentTarget.value)}
              >
                {Object.values(Comparators).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                style={{ width: 40 }}
                type="number"
                defaultValue={threshold}
                onChange={(e) =>
                  onChangeThreshold(arr, +e.currentTarget.value, comparator)
                }
              />
            </div>
          );
        })}
      </div>
      <Swatch style={{ background: pixelToRGBA(palette[output]) }}>
        <SwatchButton
          onClick={() => setIsPicking(isPicking === "output" ? null : "output")}
        />
        {isPicking === "output" && (
          <ColorPicker
            colors={palette}
            onChange={(color) => {
              const colorIndex =
                color === "wild"
                  ? -1
                  : palette.findIndex((p) => match(color, p));
              rule.output = colorIndex;
              update(rule);
              setIsPicking(null);
            }}
          />
        )}
      </Swatch>
    </StyledRuleBar>
  );
};
