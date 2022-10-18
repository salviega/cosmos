import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './CosmosEventDetails.scss'
import teams from "../../asserts/json/harcoredData.json";

export function CosmosEventDetails() {
  const auth = useAuth();
  // const navigate = useNavigate();
  const { slug } = useParams();

  const team = teams.find(
    (protectedArea) => protectedArea.id === slug
  );

  if (auth.user.walletAddress === "Connect wallet" || !team) {
    return <navigate to="/" />;
  }
  return (
    <h1>Details</h1>
  )
}