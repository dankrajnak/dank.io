import { Map } from "immutable";
import { RungeKutta } from "./RungeKutta.service";

export type Position = Map<"x" | "y" | "z", number>;

const sigma = 10;
const rho = 28;
const beta = -8 / 3;

const deltaTime = 0.005;

const rungeKuttaFunction = (p: Position): Position => {
  const x = p.get("x") || 0;
  const y = p.get("y") || 0;
  const z = p.get("z") || 0;
  return p
    .set("x", sigma * (y - x))
    .set("y", rho * x - y - x * z)
    .set("z", beta * z + x * y);
};

const rungeKuttaCalculator = RungeKutta(rungeKuttaFunction);

/**
 * Calculates the next value in a lorenz strange attractor using
 * Runge Katta approximation given sigma of 10, rho of 28,
 * beta of -8/3 with a delta time of .005.
 * @param {Position} p previous position
 */
const getNextPosition = (p: Position): Position =>
  rungeKuttaCalculator(p, deltaTime);

export default getNextPosition;
