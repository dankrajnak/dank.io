/* eslint-disable no-restricted-globals */
import * as React from "react";
import FlashScreen from "../UI/FlashScreen";

const useSafeLocation = (): [typeof location | null, JSX.Element | null] => {
  const [safeLocation, setSafeLocation] = React.useState<
    typeof location | null
  >(typeof location === "undefined" ? null : location);
  const [flash, setFlash] = React.useState<JSX.Element | null>(<FlashScreen />);
  React.useEffect(() => {
    if (typeof location === "undefined") {
      setSafeLocation(null);
    } else {
      setTimeout(() => {
        setSafeLocation(location);
        setFlash(null);
      });
    }
  }, []);

  return [safeLocation, flash];
};

// const dev = () => [location, null];

export default useSafeLocation;
