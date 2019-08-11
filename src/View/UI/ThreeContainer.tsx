import * as React from "react";

interface Props {
  start: (x0: HTMLDivElement) => any;
  stop: (x0: HTMLDivElement) => any;
  width: number;
  height: number;
}
export default React.memo(function ThreeContainer(props: Props) {
  const container = React.useRef<HTMLDivElement>(null);
  const { start, stop, width, height, ...otherProps } = props;
  React.useEffect(() => {
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
