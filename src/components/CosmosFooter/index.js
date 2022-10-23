import React from "react";
import "./CosmosFooter.scss";
import bbva from "../../asserts/images/logo-bbva.png";
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
              <img src={bbva} alt="logo" />
            </figure>
            <p className="footer-container-info-network__description">
              ® BBVA Todos los derechos reservados
            </p>
            
          </div>
          <div className="footer-container-info-marketplace">
            <p className="footer-container-info-marketplace__title">
              Redes sociales
            </p>
            <p className="footer-container-info-marketplace__subtitle">Instagram</p>
            <p className="footer-container-info-marketplace__subtitle">
              Facebook
            </p>
            <p className="footer-container-info-marketplace__subtitle">
              Twitter
            </p>
            <p className="footer-container-info-marketplace__subtitle">
              Blog BBVA
            </p>
          </div>
          <div className="footer-container-info-create">
            <p className="footer-container-info-create__title">Links de interés</p>
            <p className="footer-container-info-create__subtitle">Sobre BBVA</p>
            <p className="footer-container-info-create__subtitle">Centro de atención</p>
            <p className="footer-container-info-create__subtitle">Términos y condiciones</p>
            <p className="footer-container-info-create__subtitle">Política de privacidad</p>
          
          </div>
        </div>

      </div>
    </footer>
  );
}
