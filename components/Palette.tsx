import styled from "styled-components";
import { Pixel } from "../types/Pixel";
import pixelToRGBA from "../utils/pixelToRGBA";
import { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import { Plus, X } from "@styled-icons/foundation";
import Delete from "./Delete";

const Palette = styled.div`
  align-items: center;
  display: flex;
`;

const SwatchButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0 none;
  border-radius: 0;
  cursor: pointer;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  &:focus + ${Delete} {
    display: block;
  }
`;

const Swatch = styled.div`
  box-shadow: 0 0 2px #666;
  height: 40px;
  margin: 0 10px;
  width: 40px;

  &:hover ${Delete} {
    display: block;
  }
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
                }}
              >
                <SwatchButton
                  onClick={() => setIsPicking(isPicking === i ? -1 : i)}
                />
                {i >= 2 && (
                  <Delete
                    onClick={() => {
                      setPalette(palette.filter((_p, _i) => _i !== i));
                    }}
                  >
                    <X width={12} />
                  </Delete>
                )}
              </Swatch>
              {isPicking === i && (
                <ColorPicker
                  color={p}
                  onChange={(color) => {
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
        <div>
          <Plus
            width={18}
            style={{ marginLeft: 6 }}
            onClick={() =>
              setIsPicking(isPicking === palette.length ? -1 : palette.length)
            }
          />
          {isPicking === palette.length && (
            <ColorPicker
              onChange={(color) => {
                const pixel = {
                  r: color.rgb.r,
                  g: color.rgb.g,
                  b: color.rgb.b,
                  a: 255,
                };
                setPalette(palette.concat(pixel));
                setIsPicking(-1);
                setRefresh();
              }}
              style={{ bottom: 30 }}
            />
          )}
        </div>
      </Palette>
    </>
  );
};
