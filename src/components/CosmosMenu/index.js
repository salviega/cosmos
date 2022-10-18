import "./CosmosMenu.scss";
import logo from "../../asserts/images/logo-cosmos.png";
import iconSearch from "../../asserts/images/icon-search.png";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function CosmosMenu(props) {
  const auth = useAuth();
  const privateRoutes = true;

  return (
    <header>
      <nav className="menu">
        <div className="menu-left">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <figure>
              <img src={logo} alt="logo" />
            </figure>
          </Link>
          <div className="menu-left-search">
            <figure>
              <img src={iconSearch} alt="iconSearch" />
            </figure>
            <input className="menu-left-search__bar" placeholder="Search" />
          </div>
        </div>
        <div className="menu-center">
          {privateRoutes &&
          auth.user.walletAddress === "Connect wallet" ? null : (
            <React.Fragment>
              <p className="menu-center__item">
                <NavLink
                  to={"/"}
                >
                  {"Home"}
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to={"/create"}
                >
                  {"Add Event"}
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to={"/marketplace"}
                >
                  {"Marketplace"}
                </NavLink>
              </p>
            </React.Fragment>
          )}
        </div>
        {props.children}
      </nav>
    </header>
  );
}
