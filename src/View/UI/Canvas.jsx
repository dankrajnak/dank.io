// @flow
import React, { useEffect, type ComponentType, useRef } from "react";

type Props = {
  width: number,
  height: number,
  getContext: (context: CanvasRenderingContext2D) => any,
};

/**
 * A wrapper around the canvas element which prevents the canvas from
 * unmounting unless the width or height changes and provides a method
 * to get a rendering context.
 * @param {*} props
 * @param {*} ref
 */
const Canvas = (props: Props, ref) => {
  const canvasRef = useRef(null);
  const definedRef = ref || canvasRef;
  useEffect(() => {
    definedRef.current && props.getContext(definedRef.current.getContext("2d"));
  });
  return <canvas ref={definedRef} width={props.width} height={props.height} />;
};

export default (React.memo(React.forwardRef(Canvas)): ComponentType<Props>);
