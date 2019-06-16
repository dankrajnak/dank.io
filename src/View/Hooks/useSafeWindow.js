// @flow
import { useState } from "react";

const windowPlaceholder = {
  innerWidth: 300,
  innerHeight: 300,
  addEventListener: (event, callback) => null,
  removeEventListener: (event, callback) => null,
};

const useSafeWindow = (): typeof window => {
  const [safeWindow, setSafeWindow] = useState(windowPlaceholder);
  setTimeout(() => {
    if (typeof window === "undefined") {
      setSafeWindow(windowPlaceholder);
    } else {
      setSafeWindow(window);
    }
  }, 100);

  return safeWindow;
};

const dev = () => window;

export default dev;
