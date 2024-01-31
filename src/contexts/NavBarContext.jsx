import { createContext, useState } from "react";

const NavBarContext = createContext();

export const NavBarProvider = ({ children }) => {
  const [height, setHeight] = useState(0);

  return (
    <NavBarContext.Provider
      value={{
        height,
        setHeight,
      }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

export default NavBarContext;
