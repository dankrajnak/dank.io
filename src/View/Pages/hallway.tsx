import * as React from "react";
import useFullScreen from "../Hooks/useFullScreen";
import ThreeContainer from "../UI/ThreeContainer";
import { start, stop } from "../../Services/Hallway/Hallway.service";
import MenuLayout from "../Layout/MenuLayout";
import SEO from "../Utility/seo";

const Hallway = () => {
  const [width, height, flash] = useFullScreen();
  if (flash) {
    return flash;
  }
  return (
    <MenuLayout>
      <SEO title="Hallway" />
      <ThreeContainer start={start} stop={stop} width={width} height={height} />
    </MenuLayout>
  );
};

export default Hallway;
