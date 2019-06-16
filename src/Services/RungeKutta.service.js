// @flow
import { Map } from "immutable";

export type Vector<K> = Map<K, number>;

/**
 * Ok this might be a little confusing, but this type is a function that takes in a function f(x) where x is a Vector.
 * f returns a vector.  The function returns another function which takes in x and h and returns a vector.
 *
 * f(x) is a function in the form x' = f(x).  In other words, given a vector, it returns
 * the change (derivative) of that vector at that moment.  So, at time n, (x_n)' = f(x_n).  The method below returns a
 * function of the form x_(n+h) = g(x_n, h).  Notice that it's not the change in x, it's the actual value.
 *
 */
export type RungeKuttaType<K> = (
  f: (x: Vector<K>) => Vector<K>
) => (x: Vector<K>, h: number) => Vector<K>;

const multV = (vector: Vector<*>, n: number): Vector<*> =>
  vector.map(value => value * n);

const vplusV = (vector: Vector<*>, vectorb: Vector<*>): Vector<*> =>
  vector.map((x, i) => x + vectorb.get(i));

export const RungeKutta: RungeKuttaType<*> = f => (x, h) => {
  const a: Vector<*> = f(x);
  const b: Vector<*> = f(vplusV(x, multV(a, h / 2)));
  const c: Vector<*> = f(vplusV(x, multV(b, h / 2)));
  const d: Vector<*> = f(vplusV(x, multV(c, h)));
  // This next line is really confusing, but it amounts to
  // x + h/6 * (a + 2b + 2c + d)
  return vplusV(
    x,
    multV(vplusV(vplusV(vplusV(a, multV(b, 2)), multV(c, 2)), d), h / 6)
  );
};

export default RungeKutta;
