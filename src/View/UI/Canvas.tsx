import React, { useEffect } from "react";

interface Props {
  width: number;
  height: number;
  getContext: (context: CanvasRenderingContext2D) => void;
}

/**
 * A wrapper around the canvas element which prevents the canvas from
 * unmounting unless the width or height changes and provides a method
 * to get a rendering context.
 * @param {*} props
 * @param {*} ref
 */
const Canvas = (
  props: Props,
  ref: React.MutableRefObject<HTMLCanvasElement>
) => {
  // const canvasRef = useRef(null);
  const definedRef = ref;

  useEffect(() => {
    const context = definedRef.current.getContext("2d");
    if (context) {
      props.getContext(context);
    }
  });
  return <canvas ref={definedRef} width={props.width} height={props.height} />;
};
// @ts-ignore
export default React.memo(React.forwardRef(Canvas));
