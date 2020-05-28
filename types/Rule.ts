import { Pixel } from "./Pixel";

export interface Rule {
  input: Pixel[];
  output: Pixel;
  self: Pixel;
}
