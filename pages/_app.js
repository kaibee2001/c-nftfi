/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react"
import { Button } from '@mui/material'
import AppProvider, { AppContext } from '../context/AppContext'
import { useContext, useEffect, useState } from 'react'
import { ethers } from "ethers";
import Web3 from 'web3'

function MyApp({ Component, pageProps }) {

  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState('');

  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  // Button handler button for handling a
  // request event for metamask
  const btnhandler = () => {
    // Asking if metamask is already present or not

    console.log("connect...")

    if (window.ethereum) {
      // res[0] for fetching a first wallet

      console.log(window.ethereum)

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) =>
          accountChangeHandler(res[0])
        );
    } else {
      alert("install metamask extension!!");
    }
  };

  const getbalance = (address) => {
    // Requesting balance method
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        setdata({
          Balance:
            ethers.utils.formatEther(balance),
        });
      });
  };

  // Function for getting handling all events
  const accountChangeHandler = (account) => {
    // Setting an address data
    setdata({
      address: account,
    });

    // Setting a balance
    getbalance(account);
  };

  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">CNFTFi Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">
              Sell NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">
              My NFTs
            </a>
          </Link>
          {/* <Link href="/dashboard">
            <a className="mr-6 text-pink-500">
              Dashboard
            </a>
          </Link> */}

          <Button onClick={btnhandler} variant="primary">
            Connect Wallet
          </Button>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp