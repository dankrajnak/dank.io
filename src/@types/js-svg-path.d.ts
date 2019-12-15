declare module "js-svg-path" {
  /**
   * Trivial coordinate class
   */
  class Coord {
    constructor(x: number, y: number);
  }

  /**
   * Simple point curve Point class
   *   - plain points only have "main" set
   *   - bezier points have "left" and "right" set as control points
   * A bezier curve from p1 to p2 will consist of {p1, p1.right, p2.left, p2}
   */
  class Point {
    constructor(x: number, y: number);
    setLeft(x: number, y: number);
    setRight(x: number, y: number);
    isPlain(): boolean;
    getPoint(): Point;
    getLeft(): Point;
    getRight(): Point;
  }

  export class PointCurveShape {
    points: Point[];
    current(): Point;
    addPoint(x: number, y: number): void;
    setLeft(x: number, y: number): void;
    setRight(x: number, y: number): void;
    toSVG(): string;
  }

  export class Outline {
    constructor();
    getShapes(): PointCurveShape[];
    getShape(index: number): PointCurveShape;

    /**
     * Convert the point curve to an SVG path string (bidirectional conversion?
     * You better believe it).
     */
    toSVG(): string;

    /**
     * start a shape group
     */
    startGroup(): void;

    /**
     * start a new shape in the group
     */
    startShape(): void;

    /**
     * add an on-screen point
     */
    addPoint(x: number, y: number);

    /**
     * set the x/y coordinates for the left control point
     */
    setLeftControl(x: number, y: number);

    /**
     * set the x/y coordinates for the right control point
     */
    setRightControl(x: number, y: number);

    /**
     * Close the current shape.
     */
    closeShape(): void;

    /**
     * Close the group of shapes.
     */
    closeGroup(): void;
  }

  export class SVGParser {
    constructor(receiver: Outline);

    getReceiver(): Outline;

    parse(path: string, xoffset: number, yoffset: number);
  }

  export function parse(path: string): Outline;
}
