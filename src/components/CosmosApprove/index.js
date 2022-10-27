import React from "react";
import { useAuth, useContracts } from "../CosmosContext";
import "./CosmosApprove.scss";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ethers } from "ethers";
import benefitContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json";

export function CosmosApprove({ getItem }) {
  const [item, setItem] = React.useState({});
  const [contract, setContract] = React.useState({});
  const [buttons, setButtons] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);

  const auth = useAuth();
  const contracts = useContracts();
  // const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const data = async (id) => {
    try {
      setItem(await getItem(id));
      const item = await getItem(id);
      const benefitContract = new ethers.Contract(
        item.benefitContractAddress,
        benefitContractAbi.abi,
        contracts.web3Signer
      );
      const token = await benefitContract.tokens(0);
      const managerAddress = token[4];
      if (auth.user.walletAddress !== managerAddress.toLowerCase()) {
        return navigate("/");
      }

      setContract(benefitContract);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(error);
    }
  };

  React.useEffect(() => {
    data(slug);
    setLoading(false);
    setSincronizedItems(true);
  }, [sincronizedItems]);

  const onRedeemBenefit = () => {
    //contract.redeemBenefit(customer, id)
    console.log('QUEMADOO')
  }

  return (
    <div className="approve">
      <button
        className="details-buttons__redimir"
        onClick={onRedeemBenefit}
      >
        Quemar
      </button>
    </div>
  );
}
