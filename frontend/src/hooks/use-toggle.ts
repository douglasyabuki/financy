import { useCallback, useState } from "react";

export const useToggle = (initialState: boolean = false) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback((value?: boolean | unknown) => {
    if (typeof value === "boolean") {
      setState(value);
    } else {
      setState((prev) => !prev);
    }
  }, []);

  return [state, toggle] as const;
};
