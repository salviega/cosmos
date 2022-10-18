import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './CosmosEvent.scss';

export function CosmosEvent({event}) {
  const auth = useAuth()
  const navigate = useNavigate();

  const goDetails = () => {
    if(auth.user.walletAddress === "Connect wallet") {
      alert("Connect your wallet")
      return;
    }
    return  navigate(`/${event.id}`);
  }

  return (
    <div className="event">
      <figure >
        <img src={event.imgbase64} alt="logo" />
      </figure>
      <div className="event-description">
        <p className="event-description__title">{event.name}</p>
      </div>
      <button className="event-description__show" onClick={goDetails}>Show</button>
  </div>
  )
}