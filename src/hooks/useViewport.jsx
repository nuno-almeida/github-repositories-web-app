import { useCallback, useEffect, useState } from "react";

const getViewport = (width) =>
  width >= 992 ? "lg" : width >= 768 ? "md" : "sm";

const useViewport = () => {
  const [viewport, setViewport] = useState(() =>
    getViewport(window.innerWidth)
  );

  const updateViewport = useCallback(
    () => setViewport(getViewport(window.innerWidth)),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [updateViewport]);

  return {
    viewport,
    isLarge: viewport === "lg",
    isMedium: viewport === "md",
    isSmall: viewport === "sm",
  };
};

export default useViewport;
