import React, { ComponentType, useEffect, useRef } from "react";
import Canvas from "../Canvas.jsx";

type Props = {
  width: number;
  height: number;
  initializeCanvas?: (context: CanvasRenderingContext2D) => any;
  artist: (context: CanvasRenderingContext2D) => any;
  fps?: number | null;
};

const _moduleExport: ComponentType<Props> = React.memo(
  React.forwardRef(function CanvasDrawer(props: Props, ref) {
    const context = useRef(null);
    const requestedFrame = useRef(null);
    const canvasRef = useRef(null);
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
    useEffect(() => {
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
        getContext={getContext}
      />
    );
  })
);

export default _moduleExport;
