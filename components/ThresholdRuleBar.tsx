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
  align-items: center;
  display: flex;
  font-size: 18px;
  justify-content: space-between;
  width: 100%;

  ${SwatchButton} {
    font-size: 18px;
  }
`;

const Thresholds = styled.div`
  text-align: center;
  width: 100%;
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
  background: #eee;
  align-items: center;
  display: flex;
  margin-top: 10px;
  padding: 5px;

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

  const onChangeMatch = (match: AllOrAny) => {
    rule.match = match;
    update(rule);
  };

  return (
    <StyledThresholdRuleBar>
      <StyledRuleBarUI>
        <Swatch>
          <SwatchButton
            onClick={(e) => {
              e.stopPropagation();
              setIsPicking(isPicking === "self" ? null : "self");
            }}
            style={{
              background: isWild ? "transparent" : pixelToRGBA(palette[self]),
            }}
          >
            {isWild && "All"}
          </SwatchButton>
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
        <span>cells</span>
        <span>turn</span>
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
        <span>if there are:</span>
      </StyledRuleBarUI>
      <Thresholds>
        {thresholds.map((arr, i) => {
          const [colorIndex, comparator, threshold] = arr;
          return (
            <div key={i} style={{ width: "100%" }}>
              <Threshold>
                <select
                  defaultValue={comparator}
                  onChange={(e) =>
                    // @ts-ignore
                    onChangeComparator(i, e.currentTarget.value)
                  }
                  style={{ marginRight: 10, height: 25 }}
                >
                  <option value={Comparators.EQ}>exactly</option>
                  <option value={Comparators.LT}>less than</option>
                  <option value={Comparators.GT}>more than</option>
                  <option value={Comparators.LTE}>at most</option>
                  <option value={Comparators.GTE}>at least</option>
                </select>
                <input
                  style={{ height: 25, width: 40, textAlign: "center" }}
                  type="number"
                  max={8}
                  min={0}
                  defaultValue={threshold}
                  onChange={(e) => onChangeThreshold(i, +e.currentTarget.value)}
                />
                <Swatch style={{ margin: "0 10px", width: 25, height: 25 }}>
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
                neighbors
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
              {thresholds.length > 1 && i < thresholds.length - 1 ? (
                <div style={{ display: "flex" }}>
                  <select
                    value={rule.match}
                    // @ts-ignore
                    onChange={(e) => onChangeMatch(e.currentTarget.value)}
                    style={{ marginTop: 10 }}
                  >
                    <option value={AllOrAny.ALL}>and</option>
                    <option value={AllOrAny.ANY}>or</option>
                  </select>
                </div>
              ) : null}
            </div>
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
