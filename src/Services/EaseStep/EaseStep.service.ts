type StepEaserType = (
  numStages: number,
  period?: number,
  easeFunction?: (x0: number) => number
) => [(progress: number, index: number) => number, (index: number) => number];
/**
 * *Bad name, I know.*  This method makes it possible
 * to 'join' together the easing of various things.  It was
 * initially designed to help ease cards off of a card deck.
 *
 * For example, let's say you have three cards sitting on the deck.
 * You want to ease the first, then the second, and finally the third
 * off of the deck.  The second should move some time after the first,
 * the third after the second.  Let's say that you want to have a function
 * to which you provide one number indicating the progress through the animation
 * and an index indicating a card and you want to get the position of that card.
 *
 * This function does that, but everything is normalized.  Provide a the number
 * of things you'd like to ease, a period (if 0 then all items will move at the same
 * time, 1, all items will move directly after the previous has finished, etc.), and
 * an easing function.  This function will return a range and the function mentioned
 * above which takes in a progress number (between 0 and 1) and an index.   The range is helpful to selectively
 * make animations slower which have a larger period or more elements.
 *
 * @param {number} numThings - number of things to ease
 * @param {number} period - if 0 things will move together, if 1 will move right after eachother, .5 will move halfway, etc.
 * @param {function} easeFunction - function which takes in a number between 0 and 1
 *  and outputs another number between 0 and 1.
 * @returns {[number, function, function]} the range, a function which inputs a progress number
 * and an index and outputs the value of the thing with that index for that progress number, and a
 * function which takes an index and returns the place in the range that index starts to be eased.
 */
const stepEaser: StepEaserType = (
  numStages,
  period = 1,
  easeFunction = x => x
) => {
  // Figure out when the last stage will go and add one to it.
  const length = (numStages - 1) * period + 1;
  const getValue = (progress: number, index: number) => {
    const val = progress * length - index * period;
    if (val < 0) {
      return 0;
    }
    if (val > 1) {
      return 1;
    }
    return easeFunction(val);
  };
  const getEaseStart = (index: number) => (index * period) / length;
  return [getValue, getEaseStart];
};

export const mappedStepEaser = (
  inputFrom: number,
  inputTo: number,
  outputFrom: number,
  outputTo: number
): StepEaserType => (
  numStages: number,
  period = 1,
  easeFunction = (x: number) => x
) => {
  const inputMap = (val: number) => (val - inputFrom) / (inputTo - inputFrom);

  const outputMap = (val: number) => val * (outputTo - outputFrom) + outputFrom;

  const inputMapInverse = (val: number) =>
    val * (inputTo - inputFrom) + inputFrom;

  const [getValue, getPosition] = stepEaser(numStages, period, easeFunction);

  return [
    (progress: number, index: number) =>
      outputMap(getValue(inputMap(progress), index)),
    (index: number) => inputMapInverse(getPosition(index)),
  ];
};

export default stepEaser;
