import React from 'react';
import { CosmosEvent } from '../CosmosEvent';
import { CosmosEvents } from '../CosmosEvents';
import './CosmosHome.scss'
import events from '../../asserts/json/harcoredData.json'


export function CosmosHome() {
  return (
    <div className='home'>
      <p className='home__title'>Explore, Create & Collect</p>
      <p className='home__description'>the leading mulltichain NFT Marketplace, Home to the next generation of digital creators. Discover the best NFT collections.</p>
      <CosmosEvents>
        {events.map((event, index) => (
            <CosmosEvent key={index} event={event} />
          ))}
      </CosmosEvents>
    </div>
  )
}