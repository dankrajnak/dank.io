import * as React from "react";
import useFullScreen from "../Hooks/useFullScreen";
import ThreeContainer from "../UI/ThreeContainer";
import { start, stop } from "../../Services/Hallway/Hallway.service";
import MenuLayout from "../Layout/MenuLayout";

const Hallway = () => {
  const [width, height, flash] = useFullScreen();
  if (flash) {
    return flash;
  }
  return (
    <MenuLayout>
      <ThreeContainer start={start} stop={stop} width={width} height={height} />
    </MenuLayout>
  );
};

export default Hallway;
