import React from 'react';
import teams from "../../asserts/json/harcoredData.json";
import './CosmosEventDetails.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function CosmosEventDetails() {
  const auth = useAuth();
  const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();
  let team;
  
  if (location.state?.event) {
    team = location.state?.event
    console.log("location :", team)
  // } else if (true) {
  } else {
    team = teams.find((team) => team.id === slug);
    console.log("slug:", team)
  }

  if (auth.user.walletAddress === "Connect wallet" || !team) {
    return navigate("/");
  }

  return (
    <React.Fragment>
        <h1>Details</h1>
    </React.Fragment>
  )
}