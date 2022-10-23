import React from 'react';
import './CosmosHome.scss'
import { CosmosEvent } from '../CosmosEvent';
import { CosmosEvents } from '../CosmosEvents';
import logo from "../../asserts/images/logo-cosmos.png";

export function CosmosHome({items: events, loading, error}) {

  return (
    <div className='home'>
    { error && <h1>Error... Check the console</h1> && loading ? <h1>Loading...</h1> :
      <React.Fragment>
        <img src={logo} alt="logo" className='home__logo'></img>
        <h1 className='home__title'>Cosmos BBVA</h1>
        <h2 className='home__description'>Explora, conecta, diviértete.</h2>
        <CosmosEvents>
          {events?.map((event, index) => (
              <CosmosEvent key={index} event={event} />
            ))}
        </CosmosEvents>
      </React.Fragment>
    }
  </div>
  )
}