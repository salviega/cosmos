import "./CosmosFaucet.scss";
import React from "react";
import logo from "../../asserts/images/logo-cosmos.png";

export function CosmosFaucet() {
  return (
    <div className="faucet">
      <p className="faucet__title">Faucet</p>
      <p className="faucet__description">
        {"Retira todos los Cosmos que quieras."}
      </p>
      <div className="faucet-menu-search">
        <input className="menu-left-search__bar" placeholder="Dirección hexadecimal (0x...)" />
      </div>
      <div className="faucet-menu-search">
        <figure>
          <img src={logo} alt="logo" />
        </figure>
        <input className="menu-left-search__bar" placeholder="WEI" />
      </div>
    </div>
  );
}
