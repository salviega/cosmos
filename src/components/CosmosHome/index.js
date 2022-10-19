import React from 'react';
import './CosmosHome.scss'
import { CosmosEvent } from '../CosmosEvent';
import { CosmosEvents } from '../CosmosEvents';


export function CosmosHome({items: events, loading, error}) {

  return (
    <div className='home'>
    { error && <h1>Error... Check the console</h1> && loading ? <h1>Loading...</h1> :
      <React.Fragment>
        <p className='home__title'>Hey Villager! Welcome to Cosmos NFT</p>
        <p className='home__description'>The only place where you can browse your social networks, explore the marketplace, create and sell NFTs.</p>
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