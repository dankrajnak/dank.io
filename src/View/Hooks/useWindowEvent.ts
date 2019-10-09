import * as React from "react";
import useSafeWindow from "./useSafeWindow";

const useWindowEvent: typeof window.addEventListener = (
  type: any,
  listener: any
) => {
  const [window] = useSafeWindow();
  React.useEffect(() => {
    if (window) {
      window.addEventListener(type, listener);
    }
    return () => {
      window && window.removeEventListener(type, listener);
    };
  });
};

export default useWindowEvent;
