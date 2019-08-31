import Vector2d from "./Vector2d";

test("scaleTo produced vector with right magnitude", () => {
  const vectorOne = new Vector2d(1, 0);
  expect(vectorOne.scaleTo(2).magnitude).toBe(2);
  expect(vectorOne.scaleTo(3).magnitude).toBe(3);

  const vectorTwo = new Vector2d(1, 1);
  expect(vectorTwo.scaleTo(2).magnitude).toBeCloseTo(2);
});
