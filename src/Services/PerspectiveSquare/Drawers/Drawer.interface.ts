import Square from "../../../Domain/Square/Square";
import Vector2d from "../../../Domain/Vector/Vector2d";

export default interface PersepctiveSquareDrawer {
  /**
   * Setup before drawing occurs.
   */
  setup: () => void;
  /**
   * Draws a the squares.
   */
  draw: (squares: [Square, Square], focusPoint: Vector2d) => void;
}
