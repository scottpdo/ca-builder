export class Rule {
  output: number;
  self: number;
}

export enum Comparators {
  EQ = "=",
  LT = "<",
  GT = ">",
  LTE = "<=",
  GTE = ">=",
}

export class NeighborRule extends Rule {
  input: number[];
  constructor({
    input,
    output,
    self,
  }: {
    input: number[];
    output: number;
    self: number;
  }) {
    super();
    this.input = input;
    this.output = output;
    this.self = self;
  }
}

type ColorIndex = number;
type Threshold = number;

export enum AllOrAny {
  ALL = "all",
  ANY = "any",
}

export class ThresholdRule extends Rule {
  match: AllOrAny = AllOrAny.ANY;
  thresholds: Map<[ColorIndex, Threshold], Comparators>;
  constructor({
    thresholds,
    output,
    self,
  }: {
    thresholds: Map<[ColorIndex, Threshold], Comparators>;
    output: number;
    self: number;
  }) {
    super();
    this.thresholds = thresholds;
    this.output = output;
    this.self = self;
  }
}
