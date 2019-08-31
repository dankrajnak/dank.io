import * as React from "react";
import Canvas from "../Canvas";

interface Props {
  width: number;
  height: number;
  initializeCanvas?: (context: CanvasRenderingContext2D) => void;
  artist: (context: CanvasRenderingContext2D) => void;
  onMouseOver?: (e: React.MouseEvent) => void;
  fps?: number | null;
}

const CanvasDrawer = React.memo(
  React.forwardRef(function CanvasDrawer(props: Props, ref) {
    const context: React.MutableRefObject<CanvasRenderingContext2D | null> = React.useRef(
      null
    );
    const requestedFrame: React.MutableRefObject<number | null> = React.useRef(
      null
    );
    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = React.useRef(
      null
    );
    const draw = (context: CanvasRenderingContext2D) => {
      let then = Date.now();
      const renderFrame = () => {
        requestedFrame.current = requestAnimationFrame(() => {
          renderFrame();
          if (!props.fps) {
            props.artist(context);
          } else {
            const fps = props.fps; // don't invalidate type refinement
            const now = Date.now();
            const delta = now - then;
            const interval = 1000 / fps;
            if (delta > interval) {
              then = now - (delta % interval);
              props.artist(context);
            }
          }
        });
      };
      renderFrame();
    };
    const getContext = (c: CanvasRenderingContext2D) => (context.current = c);
    React.useEffect(() => {
      if (context.current) {
        if (props.initializeCanvas) {
          props.initializeCanvas(context.current);
        }
        draw(context.current);
      }
      return () => {
        requestedFrame.current && cancelAnimationFrame(requestedFrame.current);
      };
    });

    return (
      <Canvas
        ref={ref || canvasRef}
        width={props.width}
        height={props.height}
        onMouseOver={props.onMouseOver}
        getContext={getContext}
      />
    );
  })
);

export default CanvasDrawer;
