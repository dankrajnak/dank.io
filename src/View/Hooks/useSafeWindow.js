// @flow
import { useState, useEffect } from "react";

const windowPlaceholder = {
  innerWidth: 0,
  innerHeight: 0,
  addEventListener: (event, callback) => null,
  removeEventListener: (event, callback) => null,
};

const useSafeWindow = (): typeof window => {
  const [safeWindow, setSafeWindow] = useState(windowPlaceholder);
  useEffect(() => {
    if (typeof window === "undefined") {
      setSafeWindow(windowPlaceholder);
    } else {
      setTimeout(() => {
        setSafeWindow(window);
      });
    }
  }, []);

  return safeWindow;
};

const dev = () => window;

export default useSafeWindow;
