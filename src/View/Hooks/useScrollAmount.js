// @flow
import { useEffect, useState } from "react";
import throttle from "../../Services/Throttle.service";
import useSafeWindow from "./useSafeWindow";

/**
 * Returns how far the window is currently scrolled down.
 */
const useScrollAmount = () => {
  const window = useSafeWindow();
  const [scrollAmount, setScrollAmount] = useState(window.scrollY);
  useEffect(() => {
    const throttledFunc = throttle(() => setScrollAmount(window.scrollY), 50);
    const wheelListener = window.addEventListener("scroll", throttledFunc);

    return () => window.removeEventListener("scroll", wheelListener);
  }, [window]);
  return scrollAmount;
};

export default useScrollAmount;
