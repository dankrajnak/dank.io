import React, { useEffect, useRef, ComponentType } from "react";

type Props = {
  start: (x0: HTMLDivElement) => any;
  stop: (x0: HTMLDivElement) => any;
  width: number;
  height: number;
};

const _moduleExport: ComponentType<Props> = React.memo(function ThreeContainer(
  props: Props
) {
  const container = useRef(null);
  const { start, stop, width, height, ...otherProps } = props;
  useEffect(() => {
    if (container.current) {
      const curValOfContainer = container.current;
      start(curValOfContainer);
      return () => {
        stop(curValOfContainer);
      };
    }
  }, [start, stop]);
  return (
    <div
      ref={container}
      style={{ width: width + "px", height: height + "px" }}
      {...otherProps}
    />
  );
});

export default _moduleExport;