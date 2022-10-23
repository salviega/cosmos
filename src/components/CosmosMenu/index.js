import "./CosmosMenu.scss";
import bbva from "../../asserts/images/logo-bbva.png";
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
              <img src={bbva} alt="logo" />
            </figure>
          </Link>

        </div>
        <div className="menu-center">
          {privateRoutes &&
          auth.user.walletAddress === "Connect wallet" ? null : (
            <React.Fragment>
              <p className="menu-center__item">
                <NavLink
                  to={"/"}
                >
                  {"Inicio"}
                </NavLink>
              </p>
              <p className="menu-center__item">
                <NavLink
                  className={({ isActive }) => {
                    return isActive ? "menu-center__item--active" : "";
                  }}
                  to={"/create"}
                >
                  {"Beneficios"}
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
