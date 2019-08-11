import { Map } from "immutable";

import RungeKutta, { Vector } from "./RungeKutta.service";

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
  }) as PendulumVector;

const GRAVITY = 9.8;
const SPEED = 0.1;

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
) => (v: RungeKuttaIngestion) => RungeKuttaIngestion;

const getRungeKuttaFunctionForPendulum: FunctionForPendulum = (
  p: PendulumVector
) => (v: RungeKuttaIngestion) => {
  // This is from a website. (https://www.myphysicslab.com/pendulum/double-pendulum-en.html)
  // Also I realize that p. and v. look very similar which might make the following hard to debug / read
  // (like it wasn't hard already)
  // Sorry future me.

  // Declare all the values I need so that I don't have to worry about whether their undefined.
  const pAMass = p.get("aMass") || 0;
  const pBMass = p.get("bMass") || 0;
  const pALength = p.get("aLength") || 0;
  const pBLength = p.get("bLength") || 0;
  const vAngA = v.get("angA") || 0;
  const vAngB = v.get("angB") || 0;
  const vVelA = v.get("velA") || 0;
  const vVelB = v.get("velB") || 0;

  const angVelA = vVelA;
  const angVelB = vVelB;

  const angAccelA =
    (-GRAVITY * (2 * pAMass + pBMass) * Math.sin(vAngA) -
      pBMass * GRAVITY * Math.sin(vAngA - 2 * vAngB) -
      2 *
        Math.sin(vAngA - vAngB) *
        pBMass *
        (Math.pow(vVelB, 2) * pBLength +
          Math.pow(vVelA, 2) * pALength * Math.cos(vAngA - vAngB))) /
    (pALength *
      (2 * pAMass + pBMass - pBMass * Math.cos(2 * vAngA - 2 * vAngB)));

  const angAccelB =
    (2 *
      Math.sin(vAngA - vAngB) *
      (Math.pow(vVelA, 2) * pALength * (pAMass + pBMass) +
        GRAVITY *
          (pAMass +
            pBMass *
              Math.cos(
                vAngA +
                  Math.pow(vVelB, 2) *
                    pBLength *
                    pBMass *
                    Math.cos(vAngA - vAngB)
              )))) /
    (pBLength *
      (2 * pBMass + pBMass - pBMass * Math.cos(2 * vAngA - 2 * vAngB)));

  return Map({
    velA: angAccelA,
    velB: angAccelB,
    angA: angVelA,
    angB: angVelB,
  }) as RungeKuttaIngestion;
};

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
    .set("aAngle", map.get("angA") || 0)
    .set("bAngle", map.get("angB") || 0)
    .set("aAngularVelocity", map.get("velA") || 0)
    .set("bAngularVelocity", map.get("velB") || 0);
};

export default getNextPendulum;
