// @flow

// Decided to implement this because why not.

/**
 * Returns a new function that can only be called once within the given time.
 * @param {Function} func - the function to throttle
 * @param {*} time - the amount of time in which this function can only be called once
 */
export default function thottle(func: any => any, time: number) {
  let cooledDown = true;
  return function() {
  const funcArguments = arguments; // eslint-disable-line
    if (cooledDown) {
      func(...funcArguments);
      cooledDown = false;
      setTimeout(() => (cooledDown = true), time);
    }
  };
}
