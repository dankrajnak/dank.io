import { useEffect, useState } from "react";
import throttle from "../../Services/Throttle.service";

/**
 * Returns how far the window is currently scrolled in either the vertical
 * or horizontal direction.
 * @param {boolean} [vertical=true]
 */
const useMousePosition = (
  domElement: {
    current: EventTarget | undefined | null;
  },
  absolute: boolean = false
): [number, number] => {
  //I'm not sure this is the right thing
  const [mousePosition, setMousePosition] = useState([0, 0]);
  useEffect(() => {
    const element = domElement.current;
    const throttledFunc = throttle(
      (e: MouseEvent) =>
        setMousePosition(
          absolute ? [e.clientX, e.clientY] : [e.offsetX, e.offsetY]
        ),
      30
    );
    let mouseListener;
    if (element) {
      mouseListener = element.addEventListener("mousemove", throttledFunc);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", mouseListener);
      }
    };
  }, [absolute, domElement]);
  return mousePosition;
};

export default useMousePosition;
