import { Pixel } from "../types/Pixel";

export default ({ r, g, b, a }: Pixel): string =>
  `rgba(${r}, ${g}, ${b}, ${a})`;
