// @flow
import { useEffect, useState } from "react";
import useSafeWindow from "./useSafeWindow";

const useFullScreen = () => {
  const window = useSafeWindow();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const resize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    const listener = window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", listener);
  });
  return [width, height, window];
};

export default useFullScreen;
