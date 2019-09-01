import * as React from "react";
import useFullScreen from "../Hooks/useFullScreen";
import PerspectiveSquare from "../../Services/PerspectiveSquare/PerspectiveSquare.service";
import Square from "../../Domain/Square/Square";
import Vector2d from "../../Domain/Vector/Vector2d";
import throttle from "../../Services/Throttle/Throttle.service";
import OriginalPerspectiveSquareDrawer from "../../Services/PerspectiveSquare/Drawers/Original.service";
import styled from "styled-components";
import Canvas from "../UI/Canvas";
import MenuLayout from "../Layout/MenuLayout";
import SEO from "../Utility/seo";

const SQUARE_WIDTH = 300;

const FullScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Perspective = () => {
  const [width, height, flash] = useFullScreen();
  const [
    canvasContext,
    setContext,
  ] = React.useState<CanvasRenderingContext2D | null>(null);

  const onMouseMove = React.useRef<((event: React.MouseEvent) => void) | null>(
    null
  );

  React.useEffect(() => {
    if (!canvasContext) {
      return;
    }

    //Create the squares.
    const square = new PerspectiveSquare(
      new Square(
        SQUARE_WIDTH,
        new Vector2d((width - SQUARE_WIDTH) / 2, (height + SQUARE_WIDTH) / 2)
      ),
      100
    );

    const squareDrawer = new OriginalPerspectiveSquareDrawer(canvasContext, {
      mapper: (v: Vector2d) => new Vector2d(v.x, height - v.y),
      lineColor: "#04D9C4",
    });

    const draw = (x: number, y: number) => {
      canvasContext.fillStyle = "#0D0D0D";
      canvasContext.fillRect(0, 0, width, height);
      squareDrawer.draw(
        square.getSquares(new Vector2d(x, height - y)),
        new Vector2d(x, y)
      );
    };
    onMouseMove.current = throttle((event: React.MouseEvent) => {
      draw(event.clientX, event.clientY);
    }, 25);
    draw(width / 2, height / 2);
  }, [canvasContext, height, width]);

  if (flash) {
    return flash;
  }

  return (
    <MenuLayout color={"white"}>
      <SEO title="Perspective" />
      <FullScreen>
        <Canvas
          width={width}
          height={height}
          getContext={(context: CanvasRenderingContext2D) =>
            setContext(context)
          }
          onMouseMove={(event: React.MouseEvent) =>
            onMouseMove.current && onMouseMove.current(event)
          }
        />
      </FullScreen>
    </MenuLayout>
  );
};

export default Perspective;
