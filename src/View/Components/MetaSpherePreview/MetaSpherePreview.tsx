import * as React from "react";
import MetaSphere from "../../../Services/MetaSphere/MetaSphere";
import useClickHoverWander from "../../Hooks/useClickHoverWander";
import CanvasDrawer from "../../UI/CavnasDrawer/CanvasDrawer";

const MetaSpherePreview = (props: { width: number; height: number }) => {
  const metaDrawer = React.useRef<MetaSphere | null>(null);
  const [focusPoint, mouseProps] = useClickHoverWander(
    props.width,
    props.height
  );
  React.useEffect(() => {
    metaDrawer.current = new MetaSphere(props.width, props.height, {
      dotSize: 2,
      p: 0.002,
      numberOfColumns: 20,
      numberOfRows: 20,
      shouldSlideDots: false,
    });
  }, [props.height, props.width]);

  const artist = (ctx: CanvasRenderingContext2D) => {
    metaDrawer.current && metaDrawer.current.draw(ctx, focusPoint);
  };

  return (
    <CanvasDrawer
      width={props.width}
      height={props.height}
      artist={artist}
      {...mouseProps}
    />
  );
};

export default MetaSpherePreview;
