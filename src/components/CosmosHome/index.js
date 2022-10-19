import React from 'react';
import { CosmosEvent } from '../CosmosEvent';
import { CosmosEvents } from '../CosmosEvents';
import './CosmosHome.scss'
import events from '../../asserts/json/harcoredData.json'


export function CosmosHome() {
  return (
    <div className='home'>
      <p className='home__title'>Hey Villager! Welcome to Cosmos NFT</p>
      <p className='home__description'>The only place where you can browse your social networks, explore the marketplace, create and sell NFTs.</p>
      <CosmosEvents>
        {events.map((event, index) => (
            <CosmosEvent key={index} event={event} />
          ))}
      </CosmosEvents>
    </div>
  )
}