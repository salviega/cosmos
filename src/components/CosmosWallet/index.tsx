import './CosmosWallet.scss'
import React, { useEffect, useState } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ethers } from 'ethers';
import { useAuth } from '../../hooks/useAuth';
import RPC from './web3AuthRPC.ts';

const clientId = "BGmnaooOFOd-Tg7DnZb3dUKXyGjfA1jXyNro5m9jzpk5dTweKlIWVS03qHSAbKAXEr4rQx3xccwNUFKBNt8Uagg"; // get from https://dashboard.web3auth.io

export function CosmosWallet() {
  const [loading, setLoading] = React.useState(false)
  const auth = useAuth()

  const [address, setAddress] = useState("");
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  // !deprecated
  const connectWallet = async () => {
    if (!window.ethereum?.isMetaMask) {
      alert("Metamask wasn't detected, please install metamask extension")
      return
    }

    if (auth.user.walletAddress === 'Connect wallet') {
      setLoading(true)
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      await web3Provider.send('eth_requestAccounts', [])
      const accounts = await web3Provider.send('eth_requestAccounts', [])

      const web3Signer = web3Provider.getSigner()
      const chainId = await web3Signer.getChainId()
      if (chainId !== 43113) {
        auth.logout()
        alert("Change your network to Fuji's testnet!")
        setLoading(false)
        return
      }
      auth.login({ walletAddress: accounts[0] })
      setLoading(false)

    } else {
      auth.logout()
      setLoading(false)
    }
  }
  /**
   * web3auth connection
   */
  useEffect(() => {
    const init = async () => {
      try {

        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            // chainId: "0xA86A", // 43114 - decimal
            chainId: "0xA869",  // 43113 - decimal
            rpcTarget: "https://api.avax-test.network/ext/bc/C/rpc", // This is the public RPC we have added, please pass on your own endpoint while creating an app
            displayName: "Avalanche FUJI C-Chain",
            blockExplorer: "testnet.snowtrace.io",
            ticker: "AVAX",
            tickerName: "AVAX"
          },
          uiConfig: {
            theme: "dark",
            loginMethodsOrder: ["facebook", "google"]
          },
          displayErrorsOnModal: true,
          authMode: "DAPP",
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            loginProvider: "google",
            mfaLevel: "mandatory"
          },
          adapterSettings: {
            clientId,
            network: "testnet",
            uxMode: "popup",
            loginConfig: {
              // Add login configs corresponding to the providers on modal
              // Google login
              google: {
                name: "Custom Auth Login",
                verifier: "web3auth-oasis-nft", // Please create a verifier on the developer dashboard and pass the name here
                typeOfLogin: "google", // Pass on the login provider of the verifier you've created
                clientId: "343942140942-1jhfkr55cfk7g10sqp55pgkuilngvbau.apps.googleusercontent.com", // Pass on the clientId of the login provider here - Please note this differs from the Web3Auth ClientID. This is the JWT Client ID
              },
              // Facebook login
              facebook: {
                name: "Custom Auth Login",
                verifier: "web3auth-oasis-nft-fb", // Create a verifier on the developer dashboard and pass the name here
                typeOfLogin: "facebook", // Pass on the login provider of the verifier you've created
                clientId: "641794244227149", // Pass on the clientId of the login provider here - Please note this differs from the Web3Auth ClientID. This is the JWT Client ID
              },
              // Add other login providers here
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        };
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);


  // Login
  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    const rpc = new RPC(web3authProvider);
    const user_address = await rpc.getAccounts();
    auth.login({ walletAddress: user_address });
    setAddress(user_address);
  };

  // Getting user info
  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };
  // Logout
  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    auth.logout()
    setProvider(null);
  };
  // Getting chain id
  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };
  // Getting accounts
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };
  // Getting balance
  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };
  // Send transaction
  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };
  // Get private key
  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };
  // Unlogged view
  const unloggedInView = (
    <button className='button-wallet' onClick={login}>
      {loading ? 'loading...' : auth.user.walletAddress !== 'Connect wallet' ? '...' + String(auth.user.walletAddress).slice(36) : 'Connect wallet'}
    </button>
  );
  // Logged view
  const loggedInView = (
    <button onClick={logout} className="button-wallet">
      {`...${String(auth.user.walletAddress).slice(36)}`} Logout
    </button>
  );

  return (
    // <button className='button-wallet' onClick={connectWallet}>
    //   {loading ? 'loading...' : auth.user.walletAddress !== 'Connect wallet' ? '...' + String(auth.user.walletAddress).slice(36) : 'Connect wallet'}
    // </button>
    <>
      {provider ? loggedInView : unloggedInView}
    </>
  )
}

