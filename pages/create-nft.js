import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'

const projectId = '2OdM18NSh1dijfz4i42B7zat4wq';
const projectSecret = 'b1d224681d5e870b09f87a28a22355a0';

const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  // apiPath:'/api/v0/',
  headers: {
    authorization: auth,
  }
});

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { useReadContract, useWriteContract } from 'wagmi';
// import { useReadContract, useWriteContract } from 'wagmi'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ledaithang.infura-ipfs.io/ipfs/${added.path}`
      console.log("Thang", fileUrl)
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ledaithang.infura-ipfs.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const { writeContractAsync } = useWriteContract()
  const { data: listingPrice, refetch } = useReadContract({
    abi: NFTMarketplace.abi,
    address: marketplaceAddress,
    functionName: 'getListingPrice',
  })

  useEffect(() => {
    refetch()
  }, [])

  console.log(listingPrice)

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    // const web3Modal = new Web3Modal()
    // const connection = await web3Modal.connect()
    // const provider = new ethers.providers.Web3Provider(connection)
    // const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    // let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    // let listingPrice = await contract.getListingPrice()
    // listingPrice = listingPrice.toString()
    // let transaction = await contract.createToken(url, price, { value: listingPrice })
    // await transaction.wait()

    const ts = await writeContractAsync({
      abi: NFTMarketplace.abi,
      address: marketplaceAddress,
      functionName: "createToken",
      args: [
        url,
        price,
      ],
      value: "1000000000000000000" + ""
    })

    console.log("tx hash: ", tx)
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}