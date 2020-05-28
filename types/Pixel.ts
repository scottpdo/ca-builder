export interface Pixel {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const isPixel = (p: any): p is Pixel => {
  return (
    typeof p === "object" &&
    p.hasOwnProperty("r") &&
    p.hasOwnProperty("g") &&
    p.hasOwnProperty("b") &&
    p.hasOwnProperty("a")
  );
};

export const match = (p1: Pixel, p2: Pixel): boolean => {
  return p1.r === p2.r && p1.g === p2.g && p1.b === p2.b && p1.a === p2.a;
};
