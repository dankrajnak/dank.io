export default class Wanderer {
  public width: number;
  public height: number;
  private _wanderToFromStart: number;
  private _animationFrame: number;
  private _wandering: boolean;
  private _alpha: number;
  private _distanceFromToToFrom: number;
  private _delay: number;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this._wanderToFromStart = null;
    this._wandering = false;
    this._alpha = 3; //Parameter of easing function
  }

  public startWandering(
    callBack: (pos: [number, number]) => void,
    time: number,
    delay = 0,
    from: [number, number] = [
      Math.random() * this.width,
      Math.random() * this.height,
    ]
  ) {
    this._wandering = true;
    this._delay = delay;
    this.wanderToFrom(
      [Math.random() * this.width, Math.random() * this.height],
      from,
      time,
      callBack
    );
  }

  public stopWandering(immediately = false) {
    this._wandering = false;
    if (immediately) {
      window.cancelAnimationFrame(this._animationFrame);
      this._wanderToFromStart = null;
    }
  }

  public wanderToFrom(
    to: [number, number],
    from: [number, number],
    time: number,
    callback: (pos: [number, number]) => void
  ) {
    this._alpha = (Math.random() * 3 + 2) | 0; //Randomly pick new alpha for easing function
    this._distanceFromToToFrom = this._euclideanDistance(to, from);
    this._animationFrame = window.requestAnimationFrame(timeStep =>
      this._step(to, from, time, callback, timeStep)
    );
  }

  private _step(
    to: [number, number],
    from: [number, number],
    totalTime: number,
    callback: (pos: [number, number]) => void,
    timeStep: number
  ) {
    if (!this._wanderToFromStart) {
      this._wanderToFromStart = timeStep;
    }

    let progress = timeStep - this._wanderToFromStart;
    callback(this._interpolate(to, from, Math.min(1, progress / totalTime)));
    if (progress < totalTime)
      this._animationFrame = window.requestAnimationFrame(newTimeStep =>
        this._step(to, from, totalTime, callback, newTimeStep)
      );
    else {
      this._wanderToFromStart = null;
      //If wandering, wander from this point to a new one
      if (this._wandering) {
        if (this._delay > 0) {
          setTimeout(
            () =>
              this.wanderToFrom(
                [Math.random() * this.width, Math.random() * this.height],
                to,
                totalTime,
                callback
              ),
            this._delay
          );
        } else {
          this.wanderToFrom(
            [Math.random() * this.width, Math.random() * this.height],
            to,
            totalTime,
            callback
          );
        }
      }
    }
  }
  /**
   * Interpolates between two points
   * @param to starting point
   * @param from ending poing
   * @param t interpolation value between 0 and 1.
   */
  private _interpolate(
    to: [number, number],
    from: [number, number],
    t: number
  ): [number, number] {
    return this._distanceDownLine(
      from,
      to,
      this._distanceFromToToFrom * this._easeInOut(t)
    );
  }

  private _easeInOut(t: number): number {
    //easing function = t^a/(t^a+(1-t)^a).
    return (
      Math.pow(t, this._alpha) /
      (Math.pow(t, this._alpha) + Math.pow(1 - t, this._alpha))
    );
  }

  /**
   * Returns a point the given distance down the line specified
   * @param pointA
   * @param pointB
   * @param distance
   */
  private _distanceDownLine(
    pointA: [number, number],
    pointB: [number, number],
    distance: number
  ): [number, number] {
    //Similar triangles
    const A = pointB[1] - pointA[1];
    const B = pointB[0] - pointA[0];
    if (A === 0 && B === 0) return pointA;
    const C = this._euclideanDistance(pointA, pointB);

    const x = B - (B * (C - distance)) / C;
    const y = A - (A * (C - distance)) / C;

    return [pointA[0] + x, pointA[1] + y];
  }

  private _euclideanDistance(
    pointA: [number, number],
    pointB: [number, number]
  ): number {
    //sqrt(a^2+b^2)
    return Math.sqrt(
      Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2)
    );
  }
}
