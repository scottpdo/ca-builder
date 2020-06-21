import styled from "styled-components";
import StyledRuleBar from "./styled/StyledRuleBar";
import { Pixel, match } from "../types/Pixel";
import { ThresholdRule, Comparators, AllOrAny, Rule } from "../types/Rule";
import pixelToRGBA from "../utils/pixelToRGBA";
import SwatchButton from "./styled/SwatchButton";
import Swatch from "./styled/Swatch";
import { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import RAINBOW from "../utils/RAINBOW";
import { Plus, X } from "@styled-icons/foundation";
import Delete from "./styled/Delete";

const StyledThresholdRuleBar = styled(StyledRuleBar)`
  flex-direction: column;
  padding-bottom: 20px;
`;

const StyledLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  label {
    font-size: 13px;
    margin-bottom: 10px;
  }

  select {
    font-size: 12px;
    margin-top: -2px;
  }
`;

const StyledRuleBarUI = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Thresholds = styled.div`
  text-align: center;
`;

const AddThreshold = styled(Plus)`
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
  margin-top: 5px;

  &:hover {
    background: #ddd;
  }
`;

const DeleteThreshold = styled(X)`
  margin-left: 6px;
  opacity: 0;
  pointer-events: none;
`;

const Threshold = styled.div`
  align-items: center;
  display: flex;
  margin-right: -6px;
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }

  &:hover ${DeleteThreshold} {
    opacity: 1;
    pointer-events: auto;
  }
`;

export default ({
  deleteRule,
  palette,
  rule,
  update,
}: {
  deleteRule: (rule: Rule) => void;
  palette: Pixel[];
  rule: ThresholdRule;
  update: (r: ThresholdRule) => void;
}) => {
  const { self, output, thresholds } = rule;
  if (
    self >= palette.length ||
    output >= palette.length ||
    thresholds.some(([colorIndex]) => colorIndex >= palette.length)
  ) {
    return null;
  }
  const isWild = self === -1;

  const [isPicking, setIsPicking] = useState<"self" | "output" | number>(null);

  const hideColorPicker = () => setIsPicking(null);
  const onKeyDown = (e: KeyboardEvent) => e.keyCode === 27 && hideColorPicker();

  useEffect(() => {
    // document.body.addEventListener("click", hideColorPicker);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      // document.body.removeEventListener("click", hideColorPicker);
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  const onChangeComparator = (i: number, comparator: Comparators) => {
    thresholds[i][1] = comparator;
    update(rule);
  };

  const onChangeThreshold = (i: number, threshold: number) => {
    thresholds[i][2] = threshold;
    update(rule);
  };

  return (
    <StyledThresholdRuleBar>
      <StyledLabels>
        <label>A cell...</label>
        <label>
          with{" "}
          {thresholds.length > 1 && (
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
          )}{" "}
          neighbors matching...
        </label>
        <label>turns:</label>
      </StyledLabels>
      <StyledRuleBarUI>
        <Swatch>
          <SwatchButton
            onClick={(e) => {
              e.stopPropagation();
              setIsPicking(isPicking === "self" ? null : "self");
            }}
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
        <Thresholds>
          {thresholds.map((arr, i) => {
            const [colorIndex, comparator, threshold] = arr;
            return (
              <Threshold key={i}>
                <Swatch style={{ marginRight: 10, width: 25, height: 25 }}>
                  <SwatchButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPicking(isPicking === i ? null : i);
                    }}
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
                      style={{ bottom: 35 }}
                    />
                  )}
                </Swatch>
                <select
                  defaultValue={comparator}
                  onChange={(e) =>
                    // @ts-ignore
                    onChangeComparator(i, e.currentTarget.value)
                  }
                  style={{ marginRight: 10, height: 25 }}
                >
                  {Object.values(Comparators).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  style={{ height: 25, width: 40 }}
                  type="number"
                  max={8}
                  min={0}
                  defaultValue={threshold}
                  onChange={(e) => onChangeThreshold(i, +e.currentTarget.value)}
                />
                {i > 0 && (
                  <DeleteThreshold
                    width={12}
                    onClick={() => {
                      thresholds.splice(i, 1);
                      update(rule);
                    }}
                  />
                )}
              </Threshold>
            );
          })}
          <AddThreshold
            width={22}
            onClick={() => {
              thresholds.push([0, Comparators.EQ, 0]);
              update(rule);
            }}
          />
        </Thresholds>
        <Swatch style={{ background: pixelToRGBA(palette[output]) }}>
          <SwatchButton
            onClick={(e) => {
              e.stopPropagation();
              setIsPicking(isPicking === "output" ? null : "output");
            }}
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
      </StyledRuleBarUI>
      <Delete
        onClick={() => {
          deleteRule(rule);
        }}
      >
        <X width={12} />
      </Delete>
    </StyledThresholdRuleBar>
  );
};
