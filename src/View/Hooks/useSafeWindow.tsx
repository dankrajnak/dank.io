import * as React from "react";
import FlashScreen from "../UI/FlashScreen";

const useSafeWindow = (): [typeof window | null, JSX.Element | null] => {
  const [safeWindow, setSafeWindow] = React.useState<typeof window | null>(
    typeof window === "undefined" ? null : window
  );
  const [flash, setFlash] = React.useState<JSX.Element | null>(<FlashScreen />);
  React.useEffect(() => {
    if (typeof window === "undefined") {
      setSafeWindow(null);
    } else {
      setTimeout(() => {
        setSafeWindow(window);
        setFlash(null);
      });
    }
  }, []);

  return [safeWindow, flash];
};

// const dev = () => [window, null];

export default useSafeWindow;
