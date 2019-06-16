// flow
import { useEffect, useRef } from "react";
import throttle from "../../Services/Throttle.service";

export const useScroll = (
  listener: number => any,
  throtleAmount: number = 300
) => {
  useEffect(() => {
    const throttledFunc = throttle(
      (event: WheelEvent) => listener(event.deltaY),
      throtleAmount
    );
    const wheelListener = window.addEventListener("wheel", throttledFunc);

    return () => window.removeEventListener("wheel", wheelListener);
  }, [listener, throtleAmount]);
};

export const useScrollThreshold = (
  listener: number => any,
  threshold: number = 0.5,
  coolDown: number = 1000
) => {
  const throttledListener = useRef(
    throttle((val: number) => listener(val), coolDown)
  );
  const callback = useRef((val: number) => {
    if (val > threshold || val < -threshold) {
      throttledListener.current(val);
    }
  });

  useScroll(callback.current);
};

export default useScrollThreshold;
