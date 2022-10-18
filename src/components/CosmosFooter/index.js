import React from "react";
import "./CosmosFooter.scss";
import logoLarge from "../../asserts/images/logo-cosmos-large.png";
import discored from "../../asserts/images/icon-discored.svg";
import twitter from "../../asserts/images/icon-twitter.svg";
import instagram from "../../asserts/images/icon-instagram.svg";

export function CosmosFooter() {
  return (
    <footer className="footer">
      <div className="footer-gap"></div>
      <div className="footer-container">
        <div className="footer-container-info">
          <div className="footer-container-info-network">
            <figure>
              <img src={logoLarge} alt="logo"/>
            </figure>
            <p className="footer-container-info-network__description">
              Let's build community and grow together!
            </p>
            <div className="footer-container-info-network-icon">
              <figure>
                <img src={discored} alt="discored"/>
              </figure>
              <figure>
                <img src={twitter} alt="twitter"/>
              </figure>
              <figure>
                <img src={instagram} alt="instagram"/>
              </figure>
            </div>
          </div>
          <div className="footer-container-info-marketplace"></div>
          <div className="footer-container-info-create"></div>
        </div>
      </div>
    </footer>
  );
}
