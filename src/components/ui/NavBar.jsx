import { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import NavBarContext from "../../contexts/NavBarContext";
import useViewport from "../../hooks/useViewport";
import "./NavBar.scss";

const iconPath = "/assets/logo.png";

const NavigationLink = ({ to, text }) => {
  const { isLarge } = useViewport();

  return (
    <NavLink
      className={({ isActive }) =>
        `nav-link nav-bar-link-text ${isLarge ? "px-4" : ""}${
          isActive ? " text-decoration-underline text-black" : ""
        }`
      }
      to={to}
    >
      {text}
    </NavLink>
  );
};

const setNavbarHeight = ({ setHeight, navbarRef }) => {
  // make async the operation to get the height
  // to read it after fully open
  setTimeout(() => {
    const rect = navbarRef.current?.getBoundingClientRect();
    !!rect && setHeight(rect.height);
  }, 0);
};

const NavBar = () => {
  const { logout } = useContext(AuthContext);
  const { setHeight } = useContext(NavBarContext);
  const { isLarge, isMedium, isSmall } = useViewport();
  const navbarRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const logoutHandler = () => logout();

  useEffect(() => {
    if (isMedium || isSmall) {
      setNavbarHeight({ navbarRef, setHeight });
    }
  }, [setHeight, isMedium, isSmall]);

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg nav-bar-height bg-dark-subtle p-2 px-5 w-100"
      style={{ position: "fixed", zIndex: 9999 }}
    >
      <NavLink className="navbar-link" to="/">
        <img src={iconPath} width="30" alt="" />
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        onClick={() => {
          setShowMenu((prev) => !prev);
          setNavbarHeight({ navbarRef, setHeight });
        }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className={`d-lg-flex justify-content-lg-between w-100 collapse navbar-collapse ${
          showMenu ? "show" : ""
        }`}
      >
        <ul className="navbar-nav mr-auto">
          <NavigationLink to="/" text="Discovery" />
        </ul>

        <div
          className={`d-flex ${
            isLarge ? "align-items-center" : "align-items-start flex-column"
          }`}
        >
          <NavigationLink to="/my-account" text="My account" />
          <button
            className="btn p-0 my-1 nav-bar-link-text nav-bar-btn"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
