import stepEaser, { mappedStepEaser } from "./EaseStep.service";

test("returns 0 for no stages", () => {
  const easer = stepEaser(0)[0];
  expect(easer(0, 0)).toBe(0);
});

test("0 period moves items together", () => {
  const [easer] = stepEaser(2, 0);
  for (let i = 0; i < 1; i += 0.1) {
    expect(easer(i, 0)).toBe(easer(i, 1));
  }
});

test("1 period moves one after the other", () => {
  const numSteps = 4;
  const period = 1;
  const [easer] = stepEaser(numSteps, period);

  expect(easer(0, 0)).toBe(0);
  expect(easer(0.1, 1)).toBe(0);
  expect(easer(0.1, 0)).toBeGreaterThan(0);
  expect(easer(0.3, 1)).toBeGreaterThan(0);
  expect(easer(0.3, 2)).toBe(0);
});

test("1 period moves one after the other", () => {
  // Test that this works for 1, 2, 3... 9 steps.
  for (let numSteps = 2; numSteps < 10; numSteps++) {
    const [easer] = stepEaser(numSteps);
    // Iterate through all the steps
    for (let i = 0; i < numSteps; i++) {
      // Section the range off into chunks for every step
      const lowerBound = i / numSteps;
      const upperBound = (i + 1) / numSteps;
      for (let j = lowerBound; j < upperBound; j += 0.1) {
        // Make sure that this step is greater than 0
        expect(easer(j + 0.01, i)).toBeGreaterThan(0);
        // And the next step is 0.
        if (i < numSteps - 1) {
          expect(easer(j, i + 1)).toBe(0);
        }
      }
    }
  }
});

test("1/2 period moves halfway inbetween others", () => {
  const period = 0.5;
  // Test that this works for 1, 2, 3... 9 steps.
  for (let numSteps = 2; numSteps < 3; numSteps++) {
    const easer = stepEaser(numSteps, period)[0];
    // Iterate through all the steps
    for (let i = 0; i < numSteps; i++) {
      // Section the range off into chunks for every step
      const length = (numSteps - 1) * period + 1;
      const lowerBound = (i * period) / length;
      const upperBound = ((i + 1) * period) / length;
      for (let j = lowerBound; j < upperBound; j += 0.1) {
        // Make sure that this step is greater than 0
        expect(easer(j + 0.01, i)).toBeGreaterThan(0);
        // And the next step is 0.
        if (i < numSteps - 1) {
          expect(easer(j, i + 1)).toBe(0);
        }
      }
    }
  }
});

test("getPosition returns 0 for all elements when period is 0", () => {
  const numElements = 5;
  const getPosition = stepEaser(numElements, 0)[1];
  for (let i = 0; i < numElements; i++) {
    expect(getPosition(i)).toBe(0);
  }
});

test("getPosition returns 0 for 0 index for all periods", () => {
  for (let i = 0; i < 15; i++) {
    expect(stepEaser(5, i / 2)[1](0)).toBe(0);
  }
});

test("getPosition produces correct values for period 1", () => {
  const numElements = 5;
  const getPosition = stepEaser(numElements, 1)[1];
  expect(getPosition(0)).toBe(0);
  expect(getPosition(1)).toBe(0.2);
  expect(getPosition(2)).toBe(0.4);
  expect(getPosition(3)).toBe(0.6);
  expect(getPosition(4)).toBe(0.8);
});

test("getPosition produces correct values for period .5", () => {
  const numElements = 2;
  const getPosition = stepEaser(numElements, 0.5)[1];
  expect(getPosition(0)).toBe(0);
  expect(getPosition(1)).toBe(1 / 3);
});

// Mapped Step Easer tests
test("MappedEaseStep 0-5, 0-1", () => {
  const numElements = 5;
  const period = 1;
  const getValue = mappedStepEaser(0, 5, 0, 1)(numElements, period)[0];

  expect(getValue(0, 0)).toBe(0);

  expect(getValue(1, 0)).toBe(1);
  expect(getValue(1, 1)).toBe(0);

  expect(getValue(5, 4)).toBe(1);
});

// Mapped Step Easer tests
test("MappedEaseStep 5-0, 0-1", () => {
  const numElements = 5;
  const period = 1;
  const getValue = mappedStepEaser(5, 0, 0, 1)(numElements, period)[0];

  expect(getValue(5, 0)).toBe(0);

  expect(getValue(4, 0)).toBe(1);
  expect(getValue(4, 1)).toBe(0);

  expect(getValue(0, 4)).toBe(1);
});

// Mapped Step Easer tests
test("MappedEaseStep 5-0, 2-3", () => {
  const numElements = 5;
  const period = 1;
  const getValue = mappedStepEaser(5, 0, 2, 3)(numElements, period)[0];

  expect(getValue(5, 0)).toBe(2);

  expect(getValue(4, 0)).toBe(3);
  expect(getValue(4, 1)).toBe(2);

  expect(getValue(0, 4)).toBe(3);
});
