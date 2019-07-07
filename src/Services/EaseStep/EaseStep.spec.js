// @flow
import stepEaser from "./EaseStep.service";

test("returns 0 for no stages", () => {
  const [range, easer] = stepEaser(0);
  expect(easer(0, 0)).toBe(0);
});

test("0 period moves items together", () => {
  const [range, easer] = stepEaser(2, 0);
  for (let i = 0; i < range; i += 0.1) {
    expect(easer(i, 0)).toBe(easer(i, 1));
  }
});

test("1 period moves one after the other", () => {
  // Test that this works for 1, 2, 3... 9 steps.
  for (let numSteps = 2; numSteps < 10; numSteps++) {
    const [range, easer] = stepEaser(numSteps);
    // Iterate through all the steps
    for (let i = 0; i < numSteps; i++) {
      // Section the range off into chunks for every step
      const lowerBound = (i * range) / numSteps;
      const upperBound = lowerBound + range / numSteps;
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
  const PERIOD = 0.5;
  // Test that this works for 1, 2, 3... 9 steps.
  for (let numSteps = 2; numSteps < 10; numSteps++) {
    const [range, easer] = stepEaser(numSteps, PERIOD);
    // Iterate through all the steps
    for (let i = 0; i < numSteps; i++) {
      // Section the range off into chunks for every step
      const lowerBound = i * PERIOD;
      const upperBound = lowerBound + PERIOD;
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

test("2 steps with period 1 behave as expected", () => {
  const [range, easer] = stepEaser(2);
  expect(range).toBe(2);
  for (let i = 0; i < 1; i += 0.1) {
    expect(easer(i, 0)).toBe(i);
    expect(easer(i, 1)).toBe(0);
  }
  for (let i = 1; i < 2; i += 0.1) {
    expect(easer(i, 0)).toBe(1);
    expect(easer(i, 1)).toBe(i - 1);
  }
});

test("0 period produces the right range", () => {
  expect(stepEaser(1, 0)[0]).toBe(1);
  expect(stepEaser(2, 0)[0]).toBe(1);
  expect(stepEaser(3, 0)[0]).toBe(1);
});

test("1/2 period produces the right range", () => {
  expect(stepEaser(1, 0.5)[0]).toBe(1);
  expect(stepEaser(2, 0.5)[0]).toBe(1.5);
  expect(stepEaser(4, 0.5)[0]).toBe(2.5);
});

test("2 period produces the right range", () => {
  expect(stepEaser(2, 2)[0]).toBe(3);
});
