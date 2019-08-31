import PersepctiveSquareDrawer from "./Drawer.interface";
import Vector2d from "../../../Domain/Vector/Vector2d";
import Square from "../../../Domain/Square/Square";

interface Config {
  lineWidth?: number;
  lineColor?: string;
  mapper?: (v: Vector2d) => Vector2d;
}
export default class OriginalPerspectiveSquareDrawer
  implements PersepctiveSquareDrawer {
  private _ctx: CanvasRenderingContext2D;
  private _lineWidth: number;
  private _lineColor: string;
  private _mapper: (v: Vector2d) => Vector2d;
  public constructor(ctx: CanvasRenderingContext2D, config: Config = {}) {
    this._ctx = ctx;

    this._lineColor = config.lineColor || "black";
    this._lineWidth = config.lineWidth || 3;
    this._mapper = config.mapper || ((v: Vector2d) => v);
  }

  public setup() {
    // Do nothing.
  }

  public draw(squares: [Square, Square], focusPoint: Vector2d) {
    this._ctx.strokeStyle = this._lineColor;
    this._ctx.lineWidth = this._lineWidth;
    const [squareOne, squareTwo] = squares;
    const squareOnePoints = squareOne.pointsAsArray.map(this._mapper);
    const squareTwoPoints = squareTwo.pointsAsArray.map(this._mapper);

    // Draw dashed lines from vanish point to second square.
    this._ctx.setLineDash([0, 4, this._lineWidth, 4]);
    squareTwoPoints.forEach((point: Vector2d) => {
      this._ctx.beginPath();
      this._ctx.moveTo(focusPoint.x, focusPoint.y);
      this._ctx.lineTo(point.x, point.y);
      this._ctx.stroke();
      this._ctx.closePath();
    });
    this._ctx.setLineDash([]);

    // Draw second square.
    this._drawSquare(squareTwo);

    // Draw lines between second square and first square
    squareOnePoints.forEach((pointOne, index) => {
      this._ctx.beginPath();
      this._ctx.moveTo(pointOne.x, pointOne.y);
      this._ctx.lineTo(squareTwoPoints[index].x, squareTwoPoints[index].y);
      this._ctx.stroke();
      this._ctx.closePath();
    });

    // Draw first square.
    this._drawSquare(squareOne);
  }

  private _drawSquare(square: Square) {
    const points = square.pointsAsArray.map(this._mapper);
    this._ctx.beginPath();
    const lastPoint = points[points.length - 1];
    this._ctx.moveTo(lastPoint.x, lastPoint.y);
    points.forEach(point => this._ctx.lineTo(point.x, point.y));
    this._ctx.stroke();
    this._ctx.closePath();
  }
}
