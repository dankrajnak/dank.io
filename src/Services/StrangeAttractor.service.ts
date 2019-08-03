import { Map } from "immutable";
import { RungeKutta } from "./RungeKutta.service";

export type Position = Map<"x" | "y" | "z", number>;

const sigma = 10;
const rho = 28;
const beta = -8 / 3;

const deltaTime = 0.005;

const rungeKuttaFunction = (p: Position): Position =>
  p
    .set("x", sigma * (p.get("y") - p.get("x")))
    .set("y", rho * p.get("x") - p.get("y") - p.get("x") * p.get("z"))
    .set("z", beta * p.get("z") + p.get("x") * p.get("y"));

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
