// Private statics
const calcMagnitude = (v: Vector2d): number =>
  Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

const INVERSE_SQUARE_ROOT_TWO = 1 / Math.sqrt(2);

export default class Vector2d {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get magnitudeSquared(): number {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  }

  public get magnitude() {
    return calcMagnitude(this);
  }

  public get normalized(): Vector2d {
    const magnitude = calcMagnitude(this);
    return new Vector2d(this.x / magnitude, this.y / magnitude);
  }

  public get abs(): Vector2d {
    return new Vector2d(Math.abs(this.x), Math.abs(this.y));
  }

  /**
   * More info here: https://www.h3xed.com/programming/fast-unit-vector-calculation-for-2d-games
   */
  public get approxUnit(): Vector2d {
    if (!this.x) {
      if (!this.y) {
        return new Vector2d(0, 0);
      } else {
        return new Vector2d(0, 1);
      }
    } else if (!this.y) {
      return new Vector2d(1, 0);
    }
    const absVector = this.abs;
    let ratio = 1 / Math.max(absVector.x, absVector.y);

    ratio *=
      (1 - INVERSE_SQUARE_ROOT_TWO) * 10 -
      (absVector.x + absVector.y) * ratio * (1 - INVERSE_SQUARE_ROOT_TWO);

    return new Vector2d(this.x * ratio, this.y * ratio);
  }

  public plus(b: Vector2d): Vector2d {
    return new Vector2d(b.x + this.x, b.y + this.y);
  }

  public minus(b: Vector2d): Vector2d {
    return new Vector2d(this.x - b.x, this.y - b.y);
  }
  public dot(b: Vector2d): number {
    return this.x * b.x + this.y * b.y;
  }

  public times(scalar: number): Vector2d {
    return new Vector2d(this.x * scalar, this.y * scalar);
  }

  public scaleTo(magnitude: number): Vector2d {
    return this.normalized.times(magnitude);
  }

  public transform(matrix: [number, number, number, number]): Vector2d {
    return new Vector2d(
      this.x * matrix[0] + this.y * matrix[1],
      this.x * matrix[2] + this.y * matrix[3]
    );
  }

  public squaredDistanceTo(b: Vector2d): number {
    return Math.pow(this.x - b.x, 2) + Math.pow(this.y - b.y, 2);
  }

  public distanceTo(b: Vector2d): number {
    return Math.sqrt(this.squaredDistanceTo(b));
  }

  public clone(): Vector2d {
    return new Vector2d(this.x, this.y);
  }
}
