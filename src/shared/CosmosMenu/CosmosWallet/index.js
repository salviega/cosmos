import "./CosmosWallet.scss";
import React from "react";
import { ethers } from "ethers";
import { useAuth } from "../../../hooks/context";

export function CosmosWallet() {
  const [loading, setLoading] = React.useState(false);
  const auth = useAuth();

  const connectWallet = async () => {
    setTimeout(async () => {
      if (auth.user.walletAddress === "Connect wallet") {
        await auth.login();
        setLoading(false);
      } else {
        await auth.logout();
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <button className="button-wallet" onClick={connectWallet}>
      {loading
        ? "loading..."
        : auth.user.walletAddress !== "Connect wallet"
        ? "..." + String(auth.user.walletAddress).slice(36)
        : "Connect wallet"}
    </button>
  );
}
