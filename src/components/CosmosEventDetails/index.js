import React from 'react';
// import teams from "../../asserts/json/harcoredData.json";
import './CosmosEventDetails.scss'
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function CosmosEventDetails({ getItem }) {
  const [item, setItem] = React.useState()
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const auth = useAuth();
  const location = useLocation();
  const { slug } = useParams();

  const data = async (id) => {
    try {
      setItem(await getItem(id))
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
      console.error(error)
    }
  }

  React.useState(() => {
    if (location.state?.event) {
      setItem(location.state?.event)
    } else {
      data(slug)
    }
  })

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to='/'/>
  }

  return (
    <h1>{item?.city}</h1>
  )
}