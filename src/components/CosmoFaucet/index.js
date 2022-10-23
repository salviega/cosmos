import "./CosmosFaucet.scss";
import React, { useRef } from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ethers } from 'ethers';
import logo from "../../asserts/images/logo-cosmos.png";
import addresses from "../../blockchain/environment/contract-address.json";
import cosmoContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CosmoContract.sol/CosmoContract.json";
const cosmoContractAddress = addresses[1].cosmocontract;
const marketPlaceContractAddress = addresses[2].marketplace;


export function CosmosFaucet() {
  const auth = useAuth()
  const address = useRef();
  const wei = useRef();

  const withdrawBenefits = async(event) => {
    event.preventDefault();
    const faucetInfo = {
      address: address.current.value,
      wei: wei.current.value,
    }
    if(!faucetInfo.address || !faucetInfo.wei){
      alert("Dirección o wei vacio");
    }
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const web3Signer = web3Provider.getSigner();

    const fausetContract = new ethers.Contract(
      cosmoContractAddress,
      cosmoContractAbi.abi,
      web3Signer,
    );

    await cosmoContractAbi.authorizeOperator(marketPlaceContractAddress)
    await fausetContract.safeMint(auth.user.walletAddress, faucetInfo.wei);

  }


  if(auth.user.walletAddress === "Connect your wallet") {
    return <Navigate to='/'/>
  }

  return (
    <div className="faucet">
      <form className="faucet-form" onSubmit={withdrawBenefits}>
        <p className="faucet__title">Faucet</p>
        <p className="faucet__description">
          {"Retira todos los cosmos que quiras :)"}
        </p>
        <div className="faucet-menu-search">
          <input className="menu-left-search__bar" placeholder="Hexadecimal Address (0x...)" ref={address} />
        </div>
        <div className="faucet-menu-search">
          <figure>
            <img src={logo} alt="logo" />
          </figure>
          <input className="menu-left-search__bar" placeholder="wei" ref={wei}/>
        </div>
        <button className="maker-form__submit">Enviar</button>
      </form>
    </div>
  );
}
