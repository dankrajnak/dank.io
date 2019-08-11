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

const multV = (vector: Vector<any>, n: number): Vector<any> =>
  vector.map(value => value * n);

const vplusV = (vector: Vector<any>, vectorb: Vector<any>): Vector<any> =>
  vector.map((x, i) => x + (vectorb.get(i) || 0));

export const RungeKutta: RungeKuttaType<any> = f => (x, h) => {
  const a: Vector<any> = f(x);
  const b: Vector<any> = f(vplusV(x, multV(a, h / 2)));
  const c: Vector<any> = f(vplusV(x, multV(b, h / 2)));
  const d: Vector<any> = f(vplusV(x, multV(c, h)));
  // This next line is really confusing, but it amounts to
  // x + h/6 * (a + 2b + 2c + d)
  return vplusV(
    x,
    multV(vplusV(vplusV(vplusV(a, multV(b, 2)), multV(c, 2)), d), h / 6)
  );
};

export default RungeKutta;
