import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { useWriteContract, useReadContract } from 'wagmi'
import { marketplaceAddress } from '../config'

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput
  const { writeContractAsync } = useWriteContract()
  const { data: listingPrice } = useReadContract({
    abi: NFTMarketplace.abi,
    address: marketplaceAddress,
    functionName: 'getListingPrice',
  })
  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }



  async function listNFTForSale() {
    if (!price) return

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    try {
      const tx = await writeContractAsync({
        abi: NFTMarketplace.abi,
        address: marketplaceAddress,
        functionName: "resellToken",
        args: [
          id,
          priceFormatted,
          listingPrice + ""
        ]
      })
      console.log("tx hash: ", tx)
      router.push('/')

    } catch (error) {
      console.log(error)
    }


  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {
          image && (
            <img className="rounded mt-4" width="350" src={image} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          List NFT
        </button>
      </div>
    </div>
  )
}