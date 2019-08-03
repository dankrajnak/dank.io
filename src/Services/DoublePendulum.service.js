/* 
 There are flow types in this, but flow is being really impractical
 to correct, and there's no way to supress flow types on multiple lines,
 so we'll keep the flow types for documentation but turn off flow. 
 */

import { Map } from "immutable";

import RungeKutta, { Vector } from "./RungeKutta.service.js";

export type PendulumVector = Map<
  | "aMass"
  | "aLength"
  | "aAngle"
  | "aAngularVelocity"
  | "aAngAccel"
  | "bMass"
  | "bLength"
  | "bAngle"
  | "bAngularVelocity"
  | "bAngAccel",
  number
>;

type RungeKuttaIngestion = Vector<"velA" | "velB" | "angA" | "angB">;

export const makePendulum = (): PendulumVector =>
  Map({
    aMass: 100,
    aLength: 50 + Math.random() * 80,
    aAngle: Math.PI + Math.random() * 1 - 0.5,
    aAngularVelocity: 0,
    aAngAccel: 0,
    bMass: 50,
    bLength: 50,
    bAngle: Math.random() * 6,
    bAngularVelocity: 0,
    bAngAccel: 0,
  });

const GRAVITY = 9.8;
const SPEED = 0.1;

/**
 * Simulates chaotic pendulums utilizing the Runge-Katta algorithm
 */
const getNextPendulum = (prevPendulum: PendulumVector): PendulumVector => {
  // Ok, so the next few lines are going to get pretty complicated.
  // Just bear with me, we'll make it through together.

  /* This is really condensed.
   * RungeKutta takes in a function of the form specified by the runge katta algorithm
   * and returns a function which we can use to calculate the next state of a simulation
   * after some time.  We then store the result of this next state in the map variable.
   * after that, we return the previous pendulum with the populated with the values
   * from this map variable (it's an immutable.js map, so we're not mutating anything)
   */
  const map: RungeKuttaIngestion = RungeKutta(
    getRungeKuttaFunctionForPendulum(prevPendulum)
  )(
    Map({
      angA: prevPendulum.get("aAngle"),
      angB: prevPendulum.get("bAngle"),
      velA: prevPendulum.get("aAngularVelocity"),
      velB: prevPendulum.get("bAngularVelocity"),
    }) as RungeKuttaIngestion,
    SPEED
  );

  return prevPendulum
    .set("aAngle", map.get("angA"))
    .set("bAngle", map.get("angB"))
    .set("aAngularVelocity", map.get("velA"))
    .set("bAngularVelocity", map.get("velB"));
};

/**
 * This system of equations has 4 variables
 * the angular velocity of a,
 * the angular velocity of b,
 * the angle of a,
 * the angle of b.
 *
 * So, we need to create a function which takes in those four variables, and calculates everything else from that.
 * Hopefully this won't be super confusing to future me, but this function takes in a pendulum, and returns a function
 * that does that.
 */

type FunctionForPendulum = (
  p: PendulumVector
) => (v: RungeKuttaIngestion) => PendulumVector;

const getRungeKuttaFunctionForPendulum: FunctionForPendulum = (
  p: PendulumVector
) => (v: RungeKuttaIngestion) => {
  // This is from a website. (https://www.myphysicslab.com/pendulum/double-pendulum-en.html)
  // Also I realize that p. and v. look very similar which might make the following hard to debug / read
  // (like it wasn't hard already)
  // Sorry future me.

  const angVelA = v.get("velA");
  const angVelB = v.get("velB");

  const angAccelA =
    (-GRAVITY *
      (2 * p.get("aMass") + p.get("bMass")) *
      Math.sin(v.get("angA")) -
      p.get("bMass") * GRAVITY * Math.sin(v.get("angA") - 2 * v.get("angB")) -
      2 *
        Math.sin(v.get("angA") - v.get("angB")) *
        p.get("bMass") *
        (Math.pow(v.get("velB"), 2) * p.get("bLength") +
          Math.pow(v.get("velA"), 2) *
            p.get("aLength") *
            Math.cos(v.get("angA") - v.get("angB")))) /
    (p.get("aLength") *
      (2 * p.get("aMass") +
        p.get("bMass") -
        p.get("bMass") * Math.cos(2 * v.get("angA") - 2 * v.get("angB"))));

  const angAccelB =
    (2 *
      Math.sin(v.get("angA") - v.get("angB")) *
      (Math.pow(v.get("velA"), 2) *
        p.get("aLength") *
        (p.get("aMass") + p.get("bMass")) +
        GRAVITY *
          (p.get("aMass") +
            p.get("bMass") *
              Math.cos(
                v.get("angA") +
                  Math.pow(v.get("velB"), 2) *
                    p.get("bLength") *
                    p.get("bMass") *
                    Math.cos(v.get("angA") - v.get("angB"))
              )))) /
    (p.get("bLength") *
      (2 * p.get("bMass") +
        p.get("bMass") -
        p.get("bMass") * Math.cos(2 * v.get("angA") - 2 * v.get("angB"))));

  return Map({
    velA: angAccelA,
    velB: angAccelB,
    angA: angVelA,
    angB: angVelB,
  });
};

export default getNextPendulum;
