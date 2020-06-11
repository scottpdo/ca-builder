import styled from "styled-components";
import { Pixel } from "../types/Pixel";
import pixelToRGBA from "../utils/pixelToRGBA";
import { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";

const Palette = styled.div`
  display: inline-flex;
`;

const Swatch = styled.button`
  appearance: none;
  border: 0 none;
  border-radius: 0;
  box-shadow: 0 0 2px #666;
  height: 40px;
  margin: 0 10px;
  width: 40px;
`;

export default ({
  palette,
  setPalette,
  setRefresh,
}: {
  palette: Pixel[];
  setPalette: React.Dispatch<React.SetStateAction<Pixel[]>>;
  setRefresh: () => void;
}) => {
  const [isPicking, setIsPicking] = useState<number>(-1);
  const onKeyDown = (e) => {
    if (e.keyCode === 27) setIsPicking(-1);
  };
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <>
      <h2>Palette</h2>
      <Palette>
        {palette.map((p, i) => {
          return (
            <div key={pixelToRGBA(p)}>
              <Swatch
                onClick={() => setIsPicking(isPicking === i ? -1 : i)}
                style={{
                  background: pixelToRGBA(p),
                }}
              />
              {isPicking === i && (
                <ColorPicker
                  color={p}
                  onChange={(color) => {
                    console.log({ color });
                    const pixel = {
                      r: color.rgb.r,
                      g: color.rgb.g,
                      b: color.rgb.b,
                      a: 255,
                    };
                    const newPalette = palette.map((_p, _i) => {
                      return i === _i ? pixel : _p;
                    });
                    setPalette(newPalette);
                    setIsPicking(-1);
                    setRefresh();
                  }}
                />
              )}
            </div>
          );
        })}
      </Palette>
    </>
  );
};
