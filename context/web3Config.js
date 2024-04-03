import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { createConfig, createStorage, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Get projectId at https://cloud.walletconnect.com
export const projectId = "95b1c9524d013015651a82b2b76602ed"

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const myChain = {
  id: 9000,
  name: "My Chain",
  network: "ATI-Chain",
  nativeCurrency: {
    decimals: 18,
    name: "AIT",
    symbol: "AIT",
  },
  rpcUrls: {
    public: { http: ["http://103.252.1.159:8545"] },
    default: { http: ["http://103.252.1.159:8545"] },
  },
  // blockExplorers: {
  //   etherscan: { name: "VictionScan", url: "https://testnet.tomoscan.io/" },
  //   default: { name: "VictionScan", url: "https://testnet.tomoscan.io/" },
  // },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
}


// Create wagmiConfig
const chains = [myChain]
export const config = createConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  transports: {
    9000: http()
  }
  // ...wagmiOptions // Optional - Override createConfig parameters
})