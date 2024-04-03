/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import { Button , Box} from '@mui/material'
import { cookieToInitialState } from 'wagmi'
import Web3ModalProvider from '../context/AppContext'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { config } from '../context/web3Config'
import { useAccount, useDisconnect } from 'wagmi'


const Auth = () => {
  const { open } = useWeb3Modal()
  const { address, isConnecting, isDisconnected } = useAccount()
  const { disconnect } = useDisconnect()
  return (
    <>      {
      !address ?
        <Button onClick={() => open()} variant="contained">
          Connect Wallet
        </Button>
        : <Box display={"flex"} alignItems={"center"} gap={2}>
          <div>Address: {address}</div>
          <Button onClick={() => disconnect()} variant="outlined">
            Disconnect
          </Button>
        </Box>
    }
    </>

  )
}
function MyApp({ Component, pageProps }) {

  const initialState = cookieToInitialState(config, null)
  return (
    <Web3ModalProvider initialState={initialState}>
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
            <Auth />
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </Web3ModalProvider>
  )
}

export default MyApp