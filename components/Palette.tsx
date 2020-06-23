import styled from "styled-components";
import { Pixel } from "../types/Pixel";
import pixelToRGBA from "../utils/pixelToRGBA";
import { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import { Plus, X } from "@styled-icons/foundation";
import Delete from "./styled/Delete";
import SwatchButton from "./styled/SwatchButton";
import Swatch from "./styled/Swatch";

const Palette = styled.div`
  align-items: center;
  display: flex;
`;

export default ({
  distribution,
  palette,
  setDistribution,
  setPalette,
}: {
  distribution: number[];
  palette: Pixel[];
  setDistribution: React.Dispatch<React.SetStateAction<number[]>>;
  setPalette: React.Dispatch<React.SetStateAction<Pixel[]>>;
}) => {
  const [isPicking, setIsPicking] = useState<number>(-1);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 27) setIsPicking(-1);
  };
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <>
      <Palette>
        <h2>Palette:</h2>
        {palette.map((p, i) => {
          return (
            <div key={pixelToRGBA(p)}>
              <Swatch
                style={{
                  background: pixelToRGBA(p),
                  margin: "0 10px",
                }}
              >
                <SwatchButton
                  onClick={() => setIsPicking(isPicking === i ? -1 : i)}
                />
                {i >= 2 && (
                  <Delete
                    onClick={() => {
                      setPalette(palette.filter((_p, _i) => _i !== i));
                      const newDistribution = distribution
                        .filter((d, _i) => _i !== i)
                        .map(
                          (d) => (d * palette.length) / (palette.length - 1)
                        );
                      setDistribution(newDistribution);
                    }}
                  >
                    <X width={12} />
                  </Delete>
                )}
              </Swatch>
              {isPicking === i && (
                <ColorPicker
                  onChange={(color) => {
                    if (color === "wild") return;
                    const newPalette = palette.map((_p, _i) => {
                      return i === _i ? color : _p;
                    });
                    setPalette(newPalette);
                    setIsPicking(-1);
                  }}
                  position="bottom"
                />
              )}
            </div>
          );
        })}
        <div>
          <Plus
            width={18}
            style={{ cursor: "pointer", marginLeft: 6 }}
            onClick={() =>
              setIsPicking(isPicking === palette.length ? -1 : palette.length)
            }
          />
          {isPicking === palette.length && (
            <ColorPicker
              onChange={(color) => {
                if (color === "wild") return;
                setPalette(palette.concat(color));
                const newDistribution = distribution
                  .map(
                    (d) => (d * distribution.length) / (distribution.length + 1)
                  )
                  .concat(1 / (distribution.length + 1));
                setDistribution(newDistribution);
                setIsPicking(-1);
              }}
              style={{ left: 15, top: 30 }}
              position="bottom"
            />
          )}
        </div>
      </Palette>
    </>
  );
};
