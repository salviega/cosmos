import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import "./CosmosMarketplace.scss"

export function CosmosMarketplace() {
  const auth = useAuth()

  if(auth.user.walletAddress === "Connect your wallet") {
    return <Navigate to='/'/>
  }
  return(
    <h1>Marketplace</h1>
  )
}