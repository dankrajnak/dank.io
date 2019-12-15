// Private statics
const calcMagnitude = (v: Vector2d): number =>
  Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

export default class Vector2d {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get magnitude() {
    return calcMagnitude(this);
  }

  public get normalized(): Vector2d {
    const magnitude = calcMagnitude(this);
    return new Vector2d(this.x / magnitude, this.y / magnitude);
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

  public abs(): Vector2d {
    return new Vector2d(Math.abs(this.x), Math.abs(this.y));
  }

  public clone(): Vector2d {
    return new Vector2d(this.x, this.y);
  }
}
