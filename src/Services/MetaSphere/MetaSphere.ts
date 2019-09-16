import Vector2d from "../../Domain/Vector/Vector2d";
import Color from "color";

interface Config {
  numberOfColumns?: number;
  numberOfRows?: number;
  p?: number;
  shouldSlideDots?: boolean;
  dotSize?: number;
}

const defaultConfig = {
  numberOfColumns: 40,
  numberOfRows: 40,
  p: 0.0008,
  shouldSlideDots: true,
  dotSize: 3,
};

const constrain = (val: number, min: number, max: number) =>
  Math.max(Math.min(val, max), min);

export default class MetaSphere {
  private _width: number;
  private _height: number;
  private _dots: Vector2d[];
  public p: number;
  public shouldSlideDots: boolean;
  public dotSize: number;
  public constructor(
    width: number,
    height: number,
    config: Config = defaultConfig
  ) {
    this._width = width;
    this._height = height;
    this._dots = [];
    this.p = typeof config.p !== "undefined" ? config.p : defaultConfig.p;
    this.shouldSlideDots =
      typeof config.shouldSlideDots !== "undefined"
        ? config.shouldSlideDots
        : defaultConfig.shouldSlideDots;

    this.dotSize =
      typeof config.dotSize !== "undefined"
        ? config.dotSize
        : defaultConfig.dotSize;

    const numberOfColumns =
      config.numberOfColumns || defaultConfig.numberOfColumns;
    const numberOfRows = config.numberOfRows || defaultConfig.numberOfRows;

    for (let i = 0; i < numberOfRows * numberOfColumns; i++) {
      this._dots[i] = new Vector2d(
        (width / numberOfRows) * (i % numberOfRows),
        (height / numberOfColumns) * Math.floor(i / numberOfColumns)
      );
    }
  }

  public setup() {}

  public draw(ctx: CanvasRenderingContext2D, focusPoint: Vector2d) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this._width, this._height);

    // Draw each of the dots.
    this._dots.forEach(dot => {
      // Figure out the color of the dot.
      const color = Color.hsl(
        Math.sqrt(
          Math.pow(this._width / 2 - dot.x, 2) +
            Math.pow(this._height / 2 - dot.y, 2)
        ),
        50,
        50
      );
      ctx.fillStyle = color.hex();

      //Move the dots across the page
      if (this.shouldSlideDots) {
        if (focusPoint.x <= this._width / 2) {
          dot.x = (dot.x + 1) % this._width;
        } else {
          dot.x -= 1;
          if (dot.x <= 0) {
            dot.x = this._width;
          }
        }
      }

      //Ok, I'm going to be honest with you, this was one of the first programs
      //I made, and I coded it poorly and as a result.  I could fix most of it, but
      //I have no idea how this part actually works.
      ctx.beginPath();
      ctx.ellipse(
        constrain(
          dot.x +
            (constrain(focusPoint.x, 100, this._width - 100) - dot.x) *
              Math.sqrt(
                Math.pow(constrain(focusPoint.x, 300, 900) - dot.x, 2) +
                  Math.pow(focusPoint.y - dot.y, 2)
              ) *
              this.p,
          dot.x - 200,
          dot.x + 200
        ),
        dot.y +
          (focusPoint.y - dot.y) *
            Math.sqrt(
              Math.pow(focusPoint.x - dot.x, 2) +
                Math.pow(focusPoint.y - dot.y, 2)
            ) *
            this.p,
        this.dotSize,
        this.dotSize,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();
    });
  }
}
