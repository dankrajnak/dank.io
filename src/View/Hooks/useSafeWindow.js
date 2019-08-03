// @flow
import React, { useState, useEffect } from "react";
import FlashScreen from "../Components/FlashScreen/FlashScreen";

const windowPlaceholder = {
  innerWidth: 0,
  innerHeight: 0,
  addEventListener: (event, callback) => null,
  removeEventListener: (event, callback) => null,
};

const useSafeWindow = (): typeof window => {
  const [safeWindow, setSafeWindow] = useState(windowPlaceholder);
  const [flash, setFlash] = useState(<FlashScreen />);
  useEffect(() => {
    if (typeof window === "undefined") {
      setSafeWindow(windowPlaceholder);
    } else {
      setTimeout(() => {
        setSafeWindow(window);
        setFlash(null);
      });
    }
  }, []);

  return [safeWindow, flash];
};

const dev = () => [window, null];

export default useSafeWindow;
