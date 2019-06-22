// @flow
import { useState, useEffect } from "react";

const windowPlaceholder = {
  innerWidth: 300,
  innerHeight: 300,
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
        console.log("SET SAFE");
        setSafeWindow(window);
      }, 100);
    }
  }, []);

  return safeWindow;
};

const dev = () => window;

export default useSafeWindow;
