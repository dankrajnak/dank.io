import { useEffect, useState } from "react";
import useSafeWindow from "./useSafeWindow";

const useFullScreen = (): [number, number, JSX.Element | null] => {
  const [window, flash] = useSafeWindow();
  const [width, setWidth] = useState(window ? window.innerWidth : 0);
  const [height, setHeight] = useState(window ? window.innerHeight : 0);

  useEffect(() => {
    const resize = () => {
      if (window) {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
    };
    resize();
    const listener = window && window.addEventListener("resize", resize);
    return () => {
      window && listener && window.removeEventListener("resize", listener);
    };
  }, [window]);
  return [width, height, flash];
};

export default useFullScreen;
