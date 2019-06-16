// @flow
import { useEffect, useState } from "react";

const useDynamicLoad = (importPromise: Promise<*>) => {
  const [loaded, setLoaded] = useState(false);
  const [module, setModule] = useState(null);
  useEffect(() => {
    importPromise.then(mod => {
      setModule(mod);
      setLoaded(true);
    });
  }, [importPromise]);
  return [loaded, module];
};

export default useDynamicLoad;
