import Square from "../../Domain/Square/Square";
import Vector2d from "../../Domain/Vector/Vector2d";

export default class PerspectiveSquare {
  /**
   * Depth of perspective
   */
  public depth: number;
  /**
   * Max front square moves away from the vanishPoint.
   */
  public maxSquareDisplacement: number;

  private _squareCenter: Vector2d;
  private _square: Square;

  public constructor(square: Square, depth = 100, maxSquareDisplacement = 60) {
    this._squareCenter = square.center;

    this._square = square.clone();

    this.depth = depth;
    this.maxSquareDisplacement = maxSquareDisplacement;
  }

  public getSquares(vanishPoint: Vector2d): [Square, Square] {
    // Calculate first square
    let displacementVector = this._squareCenter.minus(vanishPoint);
    if (displacementVector.magnitude > this.maxSquareDisplacement) {
      displacementVector = displacementVector.scaleTo(
        this.maxSquareDisplacement
      );
    }

    const squareOne = new Square(
      this._square.width,
      this._square.position.plus(displacementVector)
    );

    // Calculate second square
    let squareTwo: Square;
    if (vanishPoint.minus(squareOne.points.a).magnitude < this.depth) {
      squareTwo = new Square(0, vanishPoint);
    } else {
      // Let's break out some fucking math. Alright.

      // Offset is a vector reprsenting the change in position from squareOne to squareTwo.
      const offset = vanishPoint.minus(squareOne.position).scaleTo(this.depth);

      // To get squareTwo's position, we add offset to squareOne.
      const squareTwoPosition = offset.plus(squareOne.position);

      // Then let's calculate the width.  This might not be the most efficient, but
      // we can use similar triangles and compare the distance from the top left point
      // of squareA to the vanishing point to the distance between squareTwo's position
      // and the vanishing point and use that ratio to determine the width given the width of squareOne
      const vanishPointDistance = squareOne.position.minus(vanishPoint)
        .magnitude;

      const squareTwoWidth =
        (squareOne.width * (vanishPointDistance - this.depth)) /
        vanishPointDistance;

      squareTwo = new Square(squareTwoWidth, squareTwoPosition);
    }

    return [squareOne, squareTwo];
  }
}
