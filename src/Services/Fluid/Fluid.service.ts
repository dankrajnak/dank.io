import SpatialHashMap from "../SpatialHashmap/SpatialHashmap";
import MemoService from "../Memo/Memo.service";

type State = {
  x: Float32Array; // x location
  y: Float32Array; // y location
  oldX: Float32Array; // previous x location
  oldY: Float32Array; // previous y location
  vx: Float32Array; // horizontal velocity
  vy: Float32Array; // vertical velocity
  p: Float32Array; // pressure
  pNear: Float32Array; // pressure near
  g: Float32Array; // 'nearness' to neighbour
  mesh: []; // Three.js mesh for rendering
};

const GRAVITY = [0, 9.8];
const INTERACTION_RADIUS = 10;
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;

export default class FluidService {
  public readonly state: State;
  private particleCount: number;
  private dt: number;
  private width: number;
  private height: number;
  private hashMap: SpatialHashMap;
  private X_GRID_CELLS: number;
  private Y_GRID_CELLS: number;

  constructor(
    particleCount: number,
    width: number,
    height: number,
    dt = 0.0166
  ) {
    this.state = {
      x: new Float32Array(particleCount), // x location
      y: new Float32Array(particleCount), // y location
      oldX: new Float32Array(particleCount), // previous x location
      oldY: new Float32Array(particleCount), // previous y location
      vx: new Float32Array(particleCount), // horizontal velocity
      vy: new Float32Array(particleCount), // vertical velocity
      p: new Float32Array(particleCount), // pressure
      pNear: new Float32Array(particleCount), // pressure near
      g: new Float32Array(particleCount), // 'nearness' to neighbour
      mesh: [], // Three.js mesh for rendering
    };
    this.particleCount = particleCount;
    this.dt = dt;
    this.width = width;
    this.height = height;
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
    return this.state;
  }

  private applyGlobalForces(index: number, dt: number) {
    const force = GRAVITY;
    this.state.vx[index] += force[0] * dt;
    this.state.vy[index] += force[1] * dt;
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
  private gradient = MemoService((a: [number, number], b: [number, number]) => {
    const lsq = Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);

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
   */
  private getNeighborsWithGradients(i: number) {
    const radius = (INTERACTION_RADIUS / this.width) * this.X_GRID_CELLS;

    const results = this.hashMap.query(
      this.getXGrid(this.state.x[i]),
      this.getYGrid(this.state.y[i]),
      radius
    );
    const neighbors = [];

    for (let k = 0; k < results.length; k++) {
      const n = results[k];
      if (i === n) continue; // Skip itself

      const g = this.gradient(i, n);
      if (g === 0) continue;

      this.state.g[n] = g; // Store the gradient
      neighbors.push(n); // Push the neighbour to neighbours
    }

    return neighbors;
  }

  /**
   * Pass One.  Not sure what else to say about this.
   */
  private passOne() {
    for (let i = 0; i < this.particleCount; i++) {
      // Update old state
      this.state.oldX[i] = this.state.x[i];
      this.state.oldY[i] = this.state.y[i];

      // Apply global forces
      this.applyGlobalForces(i, this.dt);

      // Store points in spatial hashmap
      this.hashMap.add(
        this.getXGrid(this.state.x[i]),
        this.getYGrid(this.state.y[i]),
        i
      );
    }
  }

  private passTwo() {
    for (let i = 0; i < this.particleCount; i++) {
      const neighbours = this.getNeighborsWithGradients(i);
      updateDensities(i, neighbours);

      // perform double density relaxation
      relax(i, neighbours, this.dt);
    }
  }
}
