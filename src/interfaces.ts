import { ethers } from 'ethers'

export type PurchaseProps = {
  chainId?: number
  name?: string
  address?: string
}

export interface ITokenProps {
  name: string
  address: string
  amount: number
  available: number
  decimals?: number
}

export enum FlashTypes {
  Error = 'error',
  Success = 'success',
}

export interface SwapFormState {
  fromName: string
  fromAddress: string
  fromAmount: number
  fromAvailable: number
  toName: string
  toAddress: string
  toAmount: number
  toAvailable: number
  convertedQuoteDecimal: number
  oneTokenAmount: number
  tokenChanged: string
  connected: boolean
  address: string
  chainId: number
  provider: ethers.providers.Web3Provider
  signer: ethers.Signer
  loading: boolean
  flash: string
  flashType: FlashTypes
  slippage: string
  loadingQuote: boolean
}
