import React from "react";
import "./CosmosEventDetails.scss";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react'
import { useAuth, useContracts } from "../CosmosContext";
import { ethers } from "ethers";
import benefitContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json";
import { CosmosLoading } from "../../shared/CosmosLoading";

export function CosmosEventDetails({ getItem }) {
  const [item, setItem] = React.useState({});
  const [contract, setContract] = React.useState({});
  const [buttons, setButtons] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);
  const auth = useAuth();
  const contracts = useContracts();
  const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const data = async (id) => {
    try {
      setItem(await getItem(id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(error);
    }
  };

  const getBenefit = async (id) => {
    const benefitContractAddress = await contracts.benefitsContract.getBenefit(
      id
    );
    const benefitContract = new ethers.Contract(
      benefitContractAddress,
      benefitContractAbi.abi,
      contracts.web3Signer
    );
    setContract(benefitContract);

    const benefitsIdByOwner = await benefitContract.getBenefitsIdsByCustomer(
      auth.user.walletAddress
    );
    const parsedBenefitsIdByOwner = benefitsIdByOwner.map(async (benefitId) => {
      const parsedIntId = ethers.BigNumber.from(benefitId).toNumber();
      const benefit = await benefitContract.tokens(parsedIntId);
      return { id: parsedIntId, checkIn: benefit[2] };
    });
    const refactoredBenefits = await Promise.all(parsedBenefitsIdByOwner);
    setButtons(refactoredBenefits);
  };

  const onCheckOut = async (benefit) => {
    console.log(benefit);
    const response = await contract.checkIn(benefit.id)

    contracts.web3Provider
      .waitForTransaction(response.hash)
      .then(async (_response) => {
        alert(`Firmas el beneficio ${benefit.id}`)
        setSincronizedItems(false)
      }) 
  };

  const mintBenefit = async () => {
    try {
      setLoading(true);
      const response = await contracts.cosmoContract.authorizeOperator(
        contract.address
      );
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contract.safeMint(
            contracts.cosmoContract.address,
            {
              gasLimit: 2500000,
            }
          );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              alert("¡Obtuviste el benefico!");
              setSincronizedItems(false);
            })
            .catch(async (error) => {
              console.log(error);
              setLoading(false);
              setError(true);
            });
        })
        .catch(async (error) => {
          console.log(error);
          setLoading(false);
          setError(true);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  React.useEffect(() => {
    if (location.state?.event) {
      setItem(location.state?.event);
      getBenefit(location.state?.event.benefitId);
      setLoading(false);
      setSincronizedItems(true);
    } else {
      data(slug);
      getBenefit(slug);
      setLoading(false);
      setSincronizedItems(true);
    }
  }, [sincronizedItems]);

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  if (!item) {
    return <></>;
  }

  return (
    <div className="details-container">
      {error && "Hubo un error... mira la consola"}
      {loading && !error && (
        <div className="details__loading">
          <CosmosLoading />
        </div>
      )}
      {!loading && !error && (
        <div className="details">
          <img src={item.imageBase64} alt="logo" />
          <div className="details__info">
            <h1>{item.name}</h1>
            <h2>{parseInt(item.price)}</h2>
            <p>{item.description}</p>
          </div>
          <div className="details-buttons">
            <button
              className="details-buttons__volver"
              onClick={() => navigate("/")}
            >
              Volver
            </button>
            <button className="details-buttons__redimir" onClick={mintBenefit}>
              Redimir
            </button>
            <div>
              {buttons ? buttons.map(
                (button, index) =>
                  !button.checkIn ? (
                    <button
                      key={index}
                      className="details-buttons__redimir"
                      onClick={() => onCheckOut(button)}
                    >
                      Check-in {button.id}
                    </button>
                  ) : 
                  <div className='qr'>
                    <QRCodeSVG value={`https://cosmos-ivory.vercel.app/approve/${button.id}`} />,
                  </div>
              ) : 'No hay beneficios que redimir'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
