import { Pixel } from "../types/Pixel";
import { utils } from "flocc";
const { zfill } = utils;

const s = (n: number): string => zfill(n.toString(16), 2);

export default ({ r, g, b }: Pixel) => `#${s(r)}${s(g)}${s(b)}`;
