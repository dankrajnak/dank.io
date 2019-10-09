import * as React from "react";
import useSafeWindow from "../Hooks/useSafeWindow";

type Props = {
  width: number;
  height: number;
  getContext: (context: CanvasRenderingContext2D) => void;
} & React.HTMLAttributes<HTMLCanvasElement>;

/**
 * A wrapper around the canvas element which prevents the canvas from
 * unmounting unless the width or height changes and provides a method
 * to get a rendering context.
 * @param {*} props
 * @param {*} ref
 */
const Canvas = (props: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [window] = useSafeWindow();
  React.useEffect(() => {
    const context = canvasRef.current && canvasRef.current.getContext("2d");
    if (context) {
      props.getContext(context);
    }
  }, [props, window]);
  const { width, height, getContext, ...otherProps } = props;
  return (
    <canvas ref={canvasRef} width={width} height={height} {...otherProps} />
  );
};
// @ts-ignore
export default React.memo(Canvas);
