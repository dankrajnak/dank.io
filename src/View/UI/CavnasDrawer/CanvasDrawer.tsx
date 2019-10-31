import * as React from "react";
import Canvas from "../Canvas";
import useSafeWindow from "../../Hooks/useSafeWindow";

interface Props {
  width: number;
  height: number;
  initializeCanvas?: (context: CanvasRenderingContext2D) => void;
  artist: (context: CanvasRenderingContext2D) => void;
  fps?: number | null;
}

const CanvasDrawer = ({
  width,
  height,
  initializeCanvas,
  artist,
  fps,
  ...otherProps
}: Props) => {
  const context: React.MutableRefObject<CanvasRenderingContext2D | null> = React.useRef(
    null
  );
  const requestedFrame: React.MutableRefObject<number | null> = React.useRef(
    null
  );

  const getContext = React.useRef(
    (c: CanvasRenderingContext2D) => (context.current = c)
  );
  React.useEffect(() => {
    const draw = (context: CanvasRenderingContext2D) => {
      let then = Date.now();
      const renderFrame = () => {
        requestedFrame.current = requestAnimationFrame(() => {
          renderFrame();
          if (!fps) {
            artist(context);
          } else {
            const now = Date.now();
            const delta = now - then;
            const interval = 1000 / fps;
            if (delta > interval) {
              then = now - (delta % interval);
              artist(context);
            }
          }
        });
      };
      renderFrame();
    };

    if (context.current) {
      if (initializeCanvas) {
        initializeCanvas(context.current);
      }
      draw(context.current);
    }
    return () => {
      requestedFrame.current && cancelAnimationFrame(requestedFrame.current);
    };
  });

  const flash = useSafeWindow()[1];

  if (flash) {
    return flash;
  }

  return (
    <Canvas
      getContext={getContext.current}
      width={width}
      height={height}
      {...otherProps}
    />
  );
};

export default React.memo(CanvasDrawer);
