import React, { useState, useContext } from 'react'

// const WalletConnectProvider = dynamic(
//   // @ts-ignore
//   () => import('@walletconnect/web3-provider'),
//   { ssr: false },
// )

// import Fortmatic from 'fortmatic'
// import Torus from '@toruslabs/torus-embed'
// const Torus = dynamic(
//   // @ts-ignore
//   () => import('@toruslabs/torus-embed'),
//   { ssr: false },
// )

// import { IProviderOptions } from 'web3modal'
import TokenAction from './TokenAction'
import { ConfigContext } from 'widgets/src/AppContext'
// import { chainIdToNetwork } from 'util/constants'
import { PurchaseProps } from 'widgets/src/interfaces'
// const Web3Modal = dynamic(
//   // @ts-ignore
//   () => import('web3modal'),
//   { ssr: false },
// )

// const initWeb3 = async (provider: any) => {
//   const Web3 = (await import('web3')).default
//   const web3: any = new Web3(provider)

//   web3.eth.extend({
//     methods: [
//       {
//         name: 'chainId',
//         call: 'eth_chainId',
//         outputFormatter: web3.utils.hexToNumber,
//       },
//     ],
//   })

//   return web3
// }

const PurchaseButton = ({ chainId = 1, name, address }: PurchaseProps) => {
  const [state] = useState({
    chainId,
    name,
    address,
    connected: false,
    web3: null,
    provider: null,
  })

  const config = useContext(ConfigContext)

  return (
    <>
      {!state.connected && (
        <TokenAction toTokenAddress={config.token?.address} chainId={chainId} />
      )}
    </>
  )
}

export default PurchaseButton
