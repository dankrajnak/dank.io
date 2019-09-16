import * as React from "react";
import MenuLayout from "../Layout/MenuLayout";
import MetaSphere from "../../Services/MetaSphere/MetaSphere";
import useFullScreen from "../Hooks/useFullScreen";
import useClickHoverWander from "../Hooks/useClickHoverWander";
import CanvasDrawer from "../UI/CavnasDrawer/CanvasDrawer";

const MetaSphereElm = () => {
  const metaDrawer = React.useRef<MetaSphere | null>(null);
  const [width, height] = useFullScreen();
  const [focusPoint, mouseProps] = useClickHoverWander(width, height);
  React.useEffect(() => {
    metaDrawer.current = new MetaSphere(width, height);
  }, [height, width]);

  const artist = (ctx: CanvasRenderingContext2D) => {
    metaDrawer.current && metaDrawer.current.draw(ctx, focusPoint);
  };

  return (
    <MenuLayout color="white">
      <CanvasDrawer
        width={width}
        height={height}
        artist={artist}
        {...mouseProps}
      />
    </MenuLayout>
  );
};

export default MetaSphereElm;
