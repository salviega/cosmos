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
              <img src={logoLarge} alt="logo" />
            </figure>
            <p className="footer-container-info-network__description">
              Let's build community and grow together!
            </p>
            <div className="footer-container-info-network-icon">
              <figure>
                <img src={discored} alt="discored" />
              </figure>
              <figure>
                <img src={twitter} alt="twitter" />
              </figure>
              <figure>
                <img src={instagram} alt="instagram" />
              </figure>
            </div>
          </div>
          <div className="footer-container-info-marketplace">
            <p className="footer-container-info-marketplace__title">
              Marketplace
            </p>
            <p className="footer-container-info-marketplace__subtitle">Blog</p>
            <p className="footer-container-info-marketplace__subtitle">
              Explore
            </p>
            <p className="footer-container-info-marketplace__subtitle">
              Tutorials
            </p>
            <p className="footer-container-info-marketplace__subtitle">
              Current Questions
            </p>
          </div>
          <div className="footer-container-info-create">
            <p className="footer-container-info-create__title">API</p>
            <p className="footer-container-info-create__subtitle">Tools</p>
            <p className="footer-container-info-create__subtitle">Tutorials</p>
            <p className="footer-container-info-create__subtitle">
              Let's talk!
            </p>
          </div>
        </div>
        <div className="footer-container-newsletter">
          <p className="footer-container-newsletter__title">Newsletter</p>
          <p className="footer-container-newsletter__description">
            Find out about news, articles, tools, tutorials, trends and
            everything we have for you
          </p>
          <div className="footer-container-newsletter-subscribe">
            <input
              className="footer-container-newsletter-subscribe__bar"
              placeholder="ro.co@gmail.com"
            ></input>
            <button className="footer-container-newsletter-subscribe__button">
              Subscribe
            </button>
          </div>
        </div>
        <p className="footer-container__copyright">© easy NFT All rights reserved</p>
      </div>
    </footer>
  );
}
