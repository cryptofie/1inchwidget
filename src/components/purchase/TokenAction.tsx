import React, { useState, useEffect, useContext, useReducer } from 'react'
import Button from '@material-ui/core/Button'

import { OneInchService } from 'core/api/oneinch'
import { ConfigContext } from 'widgets/src/AppContext'
import SwapForm from './SwapForm'
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import { base_tokens } from 'utils/constants'

import { ethers } from 'ethers'

interface ITokenActionProps {
  toTokenAddress: string
  chainId: number
}

const useStyles = makeStyles(() =>
  createStyles({
    circle: {
      color: 'white',
    },
  }),
)

const convertToUSDC = (tokenAmount, tokenDecimals) => {
  if (tokenDecimals != 18) {
    throw new Error('Token decimals not supported')
  }

  const { utils, BigNumber } = ethers

  const tokenFromWei = parseFloat(
    utils.formatEther(BigNumber.from(tokenAmount)),
  )

  return (1.0 / tokenFromWei).toFixed(6)
}

const getBaseStable = chainId => base_tokens[chainId]['USDC']

const TokenFormReducer = (state, action) => {
  switch (action.type) {
    case 'batchChange':
      return { ...state, ...action.payload }
  }
}

const TokenAction = ({ toTokenAddress, chainId }: ITokenActionProps) => {
  const initialFormState = {
    quote: {} as any,
    loadingQuote: true,
    swapFormVisible: false,
  }

  const [state, dispatch] = useReducer(TokenFormReducer, initialFormState)

  const [error] = useState(null)

  const config = useContext(ConfigContext)

  const classes = useStyles()

  // const formatSwapTx = swap => {
  //   delete swap.tx.gasPrice
  //   delete swap.tx.gas

  //   //we also need value in the form of hex
  //   const valueInt = parseInt(swap.tx['value'])
  //   const value = '0x' + valueInt.toString(16) //add a leading 0x after converting from decimal to hexadecimal

  //   swap.tx['value'] = value //set the value of value in the transaction object. value referrs to how many of the native token

  //   //temp.tx["nonce"] = nonce;                     //ethersjs will find the nonce for the user
  //   //temp.tx.chainId = 137                         //this allows the transaction to NOT be replayed on other chains, ethersjs will find it for the user
  //   return swap
  // }

  const setSwapFormVisible = swapFormVisible => {
    dispatch({
      type: 'batchChange',
      payload: {
        swapFormVisible,
      },
    })
  }

  const tokenConverter = async (fromTokenAddress, amount) => {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return await OneInchService.quote(chainId, {
      fromTokenAddress,
      toTokenAddress,
      amount,
    })
  }

  useEffect(() => {
    ;(async () => {
      // usdc address and decimal value
      const { address: baseTokenAdd, decimals: baseDecimals } = getBaseStable(
        chainId,
      )
      const quote = await tokenConverter(
        baseTokenAdd,
        1 * 10 ** parseInt(baseDecimals),
      )

      dispatch({
        type: 'batchChange',
        payload: {
          quote,
          loadingQuote: false,
        },
      })
    })()
  }, [])

  return (
    <>
      {state.swapFormVisible ? (
        <SwapForm />
      ) : (
        <>
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => setSwapFormVisible(true)}
              style={{ width: '100%' }}
            >
              <span style={{ color: 'white' }}>Buy {config.token.name} </span>
              {Object.keys(state.quote).length == 0 && (
                <CircularProgress
                  color="primary"
                  size={16}
                  classes={{ circle: classes.circle }}
                />
              )}
              {Object.keys(state.quote).length != 0 && (
                <span style={{ color: 'white' }}>
                  (
                  {parseFloat(
                    convertToUSDC(
                      state.quote.toTokenAmount,
                      state.quote.toToken.decimals,
                    ),
                  )}
                  $)
                </span>
              )}
            </Button>
          </div>
          {error && (
            <div>
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TokenAction
