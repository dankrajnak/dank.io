// @flow
import React, {
  type ComponentType,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Canvas from "./Canvas.jsx";

type Props = {
  width: number,
  height: number,
  initializeCanvas?: (context: CanvasRenderingContext2D) => any,
  artist: (context: CanvasRenderingContext2D) => any,
  fps?: ?number,
};
let requestFrame = null;
let then = Date.now();

export default (React.memo(
  function CanvasDrawer(props: Props) {
    const context = useRef(null);
    const draw = useCallback(
      (context: CanvasRenderingContext2D) => {
        requestFrame = requestAnimationFrame(() => {
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
          draw(context);
        });
      },
      [props]
    );
    const getContext = (c: CanvasRenderingContext2D) => {
      context.current = c;
      if (props.initializeCanvas) {
        props.initializeCanvas(context.current);
      }
      draw(context.current);
    };

    useEffect(() => {
      if (context.current) {
        draw(context.current);
      }
      return () => {
        requestFrame && cancelAnimationFrame(requestFrame);
      };
    });
    return (
      <Canvas
        width={props.width}
        height={props.height}
        getContext={getContext}
      />
    );
  },
  (prevProps: Props, nextProps: Props) =>
    prevProps.width === nextProps.width && prevProps.height === nextProps.height
): ComponentType<Props>);
