// @flow
import React, { useEffect, useRef, type ComponentType } from "react";

type Props = {
  start: HTMLDivElement => any,
  stop: HTMLDivElement => any,
};

export default (React.memo(function ThreeContainer(props: Props) {
  const container = useRef(null);
  const { start, stop, ...otherProps } = props;
  useEffect(() => {
    if (container.current) {
      const curValOfContainer = container.current;
      start(curValOfContainer);
      return () => {
        stop(curValOfContainer);
      };
    }
  }, [start, stop]);
  return <div ref={container} {...otherProps} />;
}): ComponentType<Props>);
