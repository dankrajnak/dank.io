import PerspectiveSquare from "./PerspectiveSquare.service";
import Square from "../../Domain/Square/Square";
import Vector2d from "../../Domain/Vector/Vector2d";

const getUnitPerspectiveSquare = (depth = 1, displacement = 0) => {
  const initialPosition = { x: 0, y: 1 };
  const square = new Square(
    1,
    new Vector2d(initialPosition.x, initialPosition.y)
  );

  return new PerspectiveSquare(square, depth, displacement);
};

const expectSquareToMatch = (test: Square, truth: Square) => {
  // Width
  expect(test.width).toBe(truth.width);
  // Position
  expect(test.position.x).toBe(truth.position.x);
  expect(test.position.y).toBe(truth.position.y);
};

test("Square one doesn't move with max displacement at 0", () => {
  const perspectiveSquare = getUnitPerspectiveSquare();
  expect(perspectiveSquare.getSquares(new Vector2d(1, 1))[0].position.x).toBe(
    0
  );
  expect(perspectiveSquare.getSquares(new Vector2d(1, 1))[0].position.y).toBe(
    1
  );
});

test("Calculates second square correctly with vanish (2, 1)", () => {
  const perspectiveSquare = getUnitPerspectiveSquare();
  const vanishPoint = new Vector2d(2, 1);
  const secondSquare = perspectiveSquare.getSquares(vanishPoint)[1];
  expectSquareToMatch(secondSquare, new Square(0.5, new Vector2d(1, 1)));
});

test("Calculates second square correctly with vanish (-2, 1)", () => {
  const perspectiveSquare = getUnitPerspectiveSquare();
  const vanishPoint = new Vector2d(-2, 1);
  const secondSquare = perspectiveSquare.getSquares(vanishPoint)[1];
  expectSquareToMatch(secondSquare, new Square(0.5, new Vector2d(-1, 1)));
});

test("Calculates second square correctly with vanish (-2, 1)", () => {
  const perspectiveSquare = getUnitPerspectiveSquare();
  const vanishPoint = new Vector2d(-2, 1);
  const secondSquare = perspectiveSquare.getSquares(vanishPoint)[1];
  expectSquareToMatch(secondSquare, new Square(0.5, new Vector2d(-1, 1)));
});

test("Calculates second square correctly with vanish (5, 1)", () => {
  const perspectiveSquare = getUnitPerspectiveSquare();
  const vanishPoint = new Vector2d(5, 1);
  const secondSquare = perspectiveSquare.getSquares(vanishPoint)[1];
  expectSquareToMatch(secondSquare, new Square(0.8, new Vector2d(1, 1)));
});

test("Displaces with vanish (1, .5)", () => {
  const perspectiveSquare = getUnitPerspectiveSquare(1, 2);
  const vanishPoint = new Vector2d(1, 0.5);
  const firstSquare = perspectiveSquare.getSquares(vanishPoint)[0];
  expectSquareToMatch(firstSquare, new Square(1, new Vector2d(-0.5, 1)));
});
