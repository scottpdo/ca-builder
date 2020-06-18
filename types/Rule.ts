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

export class ThresholdRule extends Rule {
  thresholds: Map<[number, number], Comparators>;
  constructor({
    thresholds,
    output,
    self,
  }: {
    thresholds: Map<[number, number], Comparators>;
    output: number;
    self: number;
  }) {
    super();
    this.thresholds = thresholds;
    this.output = output;
    this.self = self;
  }
}
