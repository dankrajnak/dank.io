import Vector2d from "../Vector/Vector2d";

interface Points {
  a: Vector2d;
  b: Vector2d;
  c: Vector2d;
  d: Vector2d;
}

/**
 * Represents a square in two dimensional space.
 *
 */
export default class Square {
  private _width: number;
  private _position: Vector2d;
  private _points: Points;
  /**
   *
   * @param width the width of the square
   * @param position the coordinates of the top-left point of the square
   */
  public constructor(width: number, position: Vector2d) {
    this._width = width;
    this._position = this._copyPosition(position);
    this._points = this._calcPoints();
  }

  public clone(): Square {
    return new Square(this._width, this._position);
  }

  public get center(): Vector2d {
    return new Vector2d(
      this._position.x + this._width / 2,
      this._position.y - this._width / 2
    );
  }

  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    this._width = width;
    this._points = this._calcPoints();
  }

  /**
   * Point a is the top left corner
   * Point b is the top right corner
   * Point c is the bottom left corner
   * Point d is the bottom right corner
   */
  public get points(): Points {
    return this._copyPoints(this._points);
  }

  public get pointsAsArray(): [Vector2d, Vector2d, Vector2d, Vector2d] {
    return [
      this._copyPosition(this._points.a),
      this._copyPosition(this._points.b),
      this._copyPosition(this._points.d),
      this._copyPosition(this._points.c),
    ];
  }

  public get position(): Vector2d {
    return this._copyPosition(this._position);
  }
  public set position(position: Vector2d) {
    this._position = position;
    this._points = this._calcPoints();
  }

  private _calcPoints(): Points {
    return {
      a: this._position,
      b: new Vector2d(this._position.x + this._width, this._position.y),
      c: new Vector2d(this._position.x, this.position.y - this._width),
      d: new Vector2d(
        this._position.x + this._width,
        this._position.y - this._width
      ),
    };
  }

  private _copyPosition(pos: Vector2d): Vector2d {
    return pos.clone();
  }

  private _copyPoints(points: Points): Points {
    return {
      a: this._copyPosition(points.a),
      b: this._copyPosition(points.b),
      c: this._copyPosition(points.c),
      d: this._copyPosition(points.d),
    };
  }
}
