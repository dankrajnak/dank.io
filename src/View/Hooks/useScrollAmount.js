// @flow
import { useEffect, useState } from "react";
import throttle from "../../Services/Throttle.service";
import useSafeWindow from "./useSafeWindow";

/**
 * Returns how far the window is currently scrolled in either the vertical
 * or horizontal direction.
 * @param {boolean} [vertical=true]
 */
const useScrollAmount = (vertical: boolean = true): number => {
  const [window] = useSafeWindow();
  const [scrollAmount, setScrollAmount] = useState(0);
  useEffect(() => {
    const throttledFunc = throttle(
      () => setScrollAmount(vertical ? window.scrollY : window.scrollX),
      30
    );
    const wheelListener = window.addEventListener("scroll", throttledFunc);

    return () => window.removeEventListener("scroll", wheelListener);
  }, [vertical, window]);
  return scrollAmount;
};

export default useScrollAmount;
