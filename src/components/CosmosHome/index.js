import "./CosmosHome.scss";
import React from "react";
import logo from "../../assets/images/logo-cosmos.png";
import { CosmosEvent } from "./CosmosEvent";
import { CosmosEvents } from "./CosmosEvents";

export function CosmosHome({ items: events, loading, error }) {
  return (
    <div className="home">
      <div className="home__start_page">
        <img src={logo} alt="logo" className="home__logo" />
        <h1 className="home__title">Cosmos BBVA</h1>
        <h2 className="home__description">Explora, conecta, diviértete.</h2>
      </div>
      <CosmosEvents>
        {events?.map((event, index) => (
          <CosmosEvent key={index} event={event} />
        ))}
      </CosmosEvents>
    </div>
  );
}
