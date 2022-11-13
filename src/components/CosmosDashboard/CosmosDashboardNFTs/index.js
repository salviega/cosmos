import "./CosmosDashboardNFTs.scss";
import React from "react";

export function CosmosDashboardNFTs({
  children,
  contracts,
  currency,
  setLoading,
  setSincronized,
  setItem,
  setOpenModal,
}) {
  return (
    <div className="nfts">
      <div className="nfts-container">
        {React.Children.toArray(children).map((child) =>
          React.cloneElement(child, {
            contracts,
            setLoading,
            setSincronized,
            setItem,
            setOpenModal,
          })
        )}
      </div>
    </div>
  );
}
