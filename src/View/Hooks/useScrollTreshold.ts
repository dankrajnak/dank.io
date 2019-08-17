// flow
import { useEffect, useRef } from "react";
import throttle from "../../Services/Throttle/Throttle.service";

export const useScroll = (
  listener: (x0: number) => any,
  throtleAmount: number = 300
) => {
  useEffect(() => {
    const throttledFunc = throttle(
      (event: WheelEvent) => listener(event.deltaY),
      throtleAmount
    );
    const wheelListener: any = window.addEventListener("wheel", throttledFunc);

    return () => window.removeEventListener("wheel", wheelListener);
  }, [listener, throtleAmount]);
};

export const useScrollThreshold = (
  listener: (x0: number) => any,
  threshold: number = 0.5,
  coolDown: number = 1000
) => {
  const throttledListener = useRef<(val: number) => void>(
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
