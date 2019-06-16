// @flow
import React, { useRef, useEffect, type ComponentType } from "react";

type Props = {
  width: number,
  height: number,
  getContext: (context: CanvasRenderingContext2D) => any,
};

export default (React.memo(function Canvas(props: Props) {
  const canvas = useRef(null);
  useEffect(() => {
    canvas.current && props.getContext(canvas.current.getContext("2d"));
  });
  return <canvas ref={canvas} width={props.width} height={props.height} />;
}): ComponentType<Props>);
