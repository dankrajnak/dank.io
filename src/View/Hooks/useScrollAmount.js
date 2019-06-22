// @flow
import { useEffect, useState } from "react";
import throttle from "../../Services/Throttle.service";
import useSafeWindow from "./useSafeWindow";

/**
 * Returns how far the window is currently scrolled.
 */
const useScrollAmount = (vertical: boolean = true) => {
  const window = useSafeWindow();
  const [scrollAmount, setScrollAmount] = useState(window.scrollY);
  useEffect(() => {
    const throttledFunc = throttle(
      () => setScrollAmount(vertical ? window.scrollY : window.scrollX),
      50
    );
    const wheelListener = window.addEventListener("scroll", throttledFunc);

    return () => window.removeEventListener("scroll", wheelListener);
  }, [vertical, window]);
  return scrollAmount;
};

export default useScrollAmount;
