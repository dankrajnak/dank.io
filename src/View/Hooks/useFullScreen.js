import { useEffect, useState } from "react";
import useSafeWindow from "./useSafeWindow";

const useFullScreen = () => {
  const [window, flash] = useSafeWindow();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    resize();
    const listener = window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", listener);
  }, [window]);
  return [width, height, flash];
};

export default useFullScreen;
