import SpatialHashMap from "../SpatialHashmap/SpatialHashmap";
import MemoService from "../Memo/Memo.service";
import Vector2d from "../../Domain/Vector/Vector2d";

class State {
  public readonly x: Float32Array; // x location
  public readonly y: Float32Array; // y location
  public readonly oldX: Float32Array; // previous x location
  public readonly oldY: Float32Array; // previous y location
  public readonly vx: Float32Array; // horizontal velocity
  public readonly vy: Float32Array; // vertical velocity
  public readonly p: Float32Array; // pressure
  public readonly pNear: Float32Array; // pressure near
  public readonly g: Float32Array; // 'nearness' to neighbour
  public readonly mesh: []; // Three.js mesh for rendering

  constructor(particleCount: number) {
    this.x = new Float32Array(particleCount).fill(250);
    this.y = new Float32Array(particleCount).fill(250);
    this.oldX = new Float32Array(particleCount).fill(250);
    this.oldY = new Float32Array(particleCount).fill(250);
    this.vx = new Float32Array(particleCount);
    this.vy = new Float32Array(particleCount);
    this.p = new Float32Array(particleCount);
    this.pNear = new Float32Array(particleCount);
    this.g = new Float32Array(particleCount);
    this.mesh = [];
  }

  public getPoint(index: number): Vector2d {
    return new Vector2d(this.x[index], this.y[index]);
  }

  public getOldPoint(index: number): Vector2d {
    return new Vector2d(this.oldX[index], this.oldY[index]);
  }

  public setPoint(index: number, val: Vector2d) {
    this.x[index] = val.x;
    this.y[index] = val.y;
  }
}

const GRAVITY = new Vector2d(0, 9.8);
const INTERACTION_RADIUS = 10;
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;

const STIFFNESS = 1; // NO idea what these should be.
const STIFFNESS_NEAR = 1;
const REST_DENSITY = 1;

export default class FluidService {
  public readonly state: State;
  private particleCount: number;
  private dt: number;
  private width: number;
  private height: number;
  private radius: number;
  private radiusSq: number;
  /**
   * Contents of hashmap are index of point in state.
   */
  private hashMap: SpatialHashMap<number>;
  private X_GRID_CELLS: number;
  private Y_GRID_CELLS: number;

  constructor(
    particleCount: number,
    width: number,
    height: number,
    dt = 0.0166
  ) {
    this.state = new State(particleCount);
    // Initialize points in state randomlu
    for (let i = 0; i < particleCount; i++) {
      const pos = (width / particleCount / 200) * i;
      this.state.setPoint(i, new Vector2d(pos, pos));
    }
    this.particleCount = particleCount;
    this.dt = dt;
    this.width = width;
    this.height = height;

    // TEMP
    this.radius = this.height / 2;
    this.radiusSq = this.radius * this.radius;
    this.hashMap = new SpatialHashMap(this.width, this.height);

    // Calculate number of grid cells
    this.X_GRID_CELLS = width / 10;
    this.Y_GRID_CELLS = height / 10;
  }

  /**
   * Calculates the next state
   */
  public next() {
    this.passOne();
    this.passTwo();
    this.passThree();
    return this.state;
  }

  private applyGlobalForces(index: number, dt: number) {
    const force = GRAVITY.times(dt);

    this.state.vx[index] += force.x;
    this.state.vy[index] += force.y;
  }

  private getXGrid(pos: number): number {
    return (pos / this.width) * this.X_GRID_CELLS;
  }

  private getYGrid(pos: number): number {
    return (pos / this.height) * this.Y_GRID_CELLS;
  }

  /**
   * Returns a *'gradient'* describing how far away these two points are.
   * In this context, a gradient is between 0 and 1, with 1 indicating that the
   * points are very close to eachother, and 0 indicating they are far.
   *
   * More concretely, 0 indicates that the points are at least `INTERACTION_RADIUS`
   * apart.
   * @param a first point
   * @param b second point
   *
   * @returns gradient for these two points.
   */
  private gradient = MemoService((a: Vector2d, b: Vector2d) => {
    const lsq = a.squaredDistanceTo(b);

    if (lsq > INTERACTION_RADIUS_SQ) {
      return 0;
    }

    const distance = Math.sqrt(lsq);
    return 1 - distance / INTERACTION_RADIUS;
  });

  /**
   * **Not Pure**
   *
   * Returns neighbors with a non-zero gradient and stores their
   * gradients in the global state.
   * @param i index of the point in state.
   * @returns array of indexes of all neighbors
   */
  private getNeighborsWithGradients(i: number): number[] {
    const radius = (INTERACTION_RADIUS / this.width) * this.X_GRID_CELLS;
    const point = this.state.getPoint(i);

    const results = this.hashMap.query(
      this.getXGrid(point.x),
      this.getYGrid(point.y),
      radius
    );
    const neighbors = [];

    for (let k = 0; k < results.length; k++) {
      const n = results[k];
      if (i === n) continue; // Skip itself

      const g = this.gradient(point, this.state.getPoint(n));
      if (g === 0) continue;

      this.state.g[n] = g; // Store the gradient
      neighbors.push(n); // Push the neighbor to neighbors
    }

    return neighbors;
  }

  /**
   * **Not Pure**
   * Updates global state with pressures for this point.
   */
  private updatePressure(index: number, neighbors: number[]) {
    let density = 0;
    let nearDensity = 0;

    for (let k = 0; k < neighbors.length; k++) {
      const g = this.state.g[neighbors[k]]; // Get g for this neighbour
      density += g * g;
      nearDensity += g * g * g;
    }

    this.state.p[index] = STIFFNESS * (density - REST_DENSITY);
    this.state.pNear[index] = STIFFNESS_NEAR * nearDensity;
  }

  /**
   * **Not Pure**
   * Applies density relaxation algorithm to point.
   */
  private relax(index: number, neighbors: number[], dt: number) {
    const pos = this.state.getPoint(index);

    for (let k = 0; k < neighbors.length; k++) {
      const n = neighbors[k];
      const g = this.state.g[n];

      const nPos = this.state.getPoint(n);
      const magnitude =
        this.state.p[index] * g + this.state.pNear[index] * g * g;

      const direction = nPos.minus(pos).approxUnit;
      const force = direction.times(magnitude);

      const d = force.times(dt * dt).times(-0.05);
      this.state.setPoint(
        index,
        this.state.getPoint(index).plus(d.times(-0.5))
      );
      this.state.setPoint(n, this.state.getPoint(n).plus(d.times(0.5)));
    }
  }

  private contain(index: number) {
    const pos = this.state.getPoint(index);

    if (pos.magnitudeSquared > this.radiusSq) {
      const unitPos = pos.normalized;
      const newPos = unitPos.times(this.radius);

      this.state.setPoint(index, newPos);
    }
  }

  private calculateVelocity(index: number, dt: number) {
    const pos = this.state.getPoint(index);
    const old = this.state.getOldPoint(index);

    const v = pos.minus(old).times(1 / dt);

    this.state.vx[index] = v.x;
    this.state.vy[index] = v.y;
  }

  /**
   * Pass One.  Not sure what else to say about this.
   */
  private passOne() {
    for (let i = 0; i < this.particleCount; i++) {
      const point = this.state.getPoint(i);
      // Update old state
      this.state.oldX[i] = point.x;
      this.state.oldY[i] = point.y;

      // Apply global forces
      this.applyGlobalForces(i, this.dt);

      // Update positions
      this.state.setPoint(
        i,
        this.state
          .getPoint(i)
          .plus(new Vector2d(this.state.vx[i], this.state.vy[i]).times(this.dt))
      );

      // Store points in spatial hashmap
      this.hashMap.add(this.getXGrid(point.x), this.getYGrid(point.y), i);
    }
  }

  private passTwo() {
    for (let i = 0; i < this.particleCount; i++) {
      const neighbours = this.getNeighborsWithGradients(i);
      this.updatePressure(i, neighbours);

      // perform double density relaxation
      this.relax(i, neighbours, this.dt);
    }
  }

  /**
   * Contain particles within a boundary.
   */
  private passThree() {
    for (let i = 0; i < this.particleCount; i++) {
      // Constrain the particles to a container
      this.contain(i);

      // Calculate new velocities
      this.calculateVelocity(i, this.dt);

      // Update
      // this.state.mesh[i].position.set(state.x[i], state.y[i], 0);
    }
  }
}
