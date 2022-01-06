import React, { useContext, useEffect, useReducer, useState } from 'react'
import clsx from 'clsx'

import {
  Theme,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import createStyles from '@material-ui/styles/createStyles'
import makeStyles from '@material-ui/styles/makeStyles'
import Avatar from '@material-ui/core/Avatar'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

import { base_tokens, chainIdToNetwork, slippage } from 'utils/constants'
import { ConfigContext } from 'widgets/src/AppContext'
import { FlashTypes, SwapFormState } from 'widgets/src/interfaces'
import { SwapFormReducer } from './SwapFormReducer'
import { IProviderOptions } from 'web3modal'
import { ethers } from 'ethers'
import { getBalance, getBaseTokenDecimals } from 'utils/contracts'
import { usePrevious } from 'core/hooks'
import { OneInchService } from 'core/api/oneinch'
import CurrencyComponent from './CurrencyComponent'
import FlashComponent from './Flash'
import { chainInfo } from 'utils/constants'
import SwapSettings from './SwapSettings'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      height: 28,
      margin: 4,
    },
    boxRoot: {
      display: 'flex',
      alignItems: 'center',
      background: 'rgb(237, 238, 242)',
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
    },
    error: {
      border: '1px solid #ff0000',
    },
    iconRoot: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      flexDirection: 'column',
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    quote: {
      color: theme.palette.grey[600],
      marginBottom: theme.spacing(1),
      fontWeight: 'bold',
      fontSize: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressRoot: {
      fontSize: 10,
    },
  }),
)

const getProviderOptions = async network => {
  const WalletConnectProvider = (await import('@walletconnect/web3-provider'))
    .default

  const providerOptions: IProviderOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      // options: {
      //   infuraId: process.env.REACT_APP_INFURA_ID,
      // },
      options: {
        network,
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
          1: 'https://speedy-nodes-nyc.moralis.io/0f4999f53b24ca14339633b4/eth/mainnet',
        },
      },
    },
  }
  return providerOptions
}

const SwapForm = () => {
  const classes = useStyles()
  const swapContext = useContext(ConfigContext)

  const {
    token: { chainId, name, address },
  } = swapContext

  const baseCurrencies = base_tokens[chainId]
  const targetCurrency = { [name]: address }

  const initialSwapState: SwapFormState = {
    fromName: 'ETH',
    fromAddress: baseCurrencies['ETH']['address'],
    fromAmount: 0,
    fromAvailable: 0,
    toName: name,
    toAddress: address,
    toAmount: 0,
    toAvailable: 0,
    convertedQuoteDecimal: 18,
    oneTokenAmount: 0,
    tokenChanged: '',
    address: '',
    chainId,
    provider: null,
    connected: false,
    signer: null,
    loading: false,
    flash: '',
    flashType: null,
    slippage,
    loadingQuote: false,
  }

  const [state, dispatch] = useReducer(SwapFormReducer, initialSwapState)
  const prevState = usePrevious(state)

  const { convertedQuoteDecimal, oneTokenAmount } = state
  const oneUnitFromAmount = (
    (1 * Math.pow(10, convertedQuoteDecimal)) /
    oneTokenAmount
  ).toFixed(6)

  const onTokenAmountChange = (value, fieldType) => {
    if (fieldType == 'fromAmount') {
      dispatch({
        type: 'batchChange',
        payload: {
          fromAmount: value,
          tokenChanged: fieldType,
        },
      })
    } else {
      dispatch({
        type: 'batchChange',
        payload: {
          toAmount: value,
          tokenChanged: fieldType,
        },
      })
    }
  }

  const getConvertedValue = async (value, fieldType) => {
    let fromAmount, toAmount

    const { fromAddress, toAddress } = state
    const fromDecimals = getBaseTokenDecimals(fromAddress, chainId)

    // Fetching for 1 unit of token
    const decimalAmounnt = 1 * Math.pow(10, fromDecimals)
    dispatch({
      type: 'batchChange',
      payload: {
        loadingQuote: true,
      },
    })
    const quote = await OneInchService.quote(chainId, {
      fromTokenAddress: fromAddress,
      toTokenAddress: toAddress,
      amount: decimalAmounnt.toString(),
    })
    const {
      toToken: { decimals },
      toTokenAmount,
    } = quote
    const convertedQuoteDecimal = decimals
    const oneTokenAmount = toTokenAmount

    if (fieldType == 'fromToken') {
      fromAmount = state.fromAmount
      toAmount = (
        (oneTokenAmount * value) /
        Math.pow(10, convertedQuoteDecimal)
      ).toFixed(6)
      dispatch({
        type: 'batchChange',
        payload: {
          toAmount,
          convertedQuoteDecimal,
          oneTokenAmount,
          // tokenChanged: '',
          loadingQuote: false,
        },
      })
    } else {
      toAmount = value
      fromAmount = (
        (toAmount * Math.pow(10, convertedQuoteDecimal)) /
        oneTokenAmount
      ).toFixed(6)
      dispatch({
        type: 'batchChange',
        payload: {
          fromAmount,
          convertedQuoteDecimal,
          oneTokenAmount,
          // tokenChanged: '',
          loadingQuote: false,
        },
      })
    }
  }

  const onTokenChangeHandler = event => {
    const name = event.target.innerText
    const { address } = baseCurrencies[name]

    dispatch({
      type: 'fromAddressChange',
      payload: { fromName: name, fromAddress: address },
    })
  }

  const SwapButton = ({ selectedChainId, state }) => {
    const { loading } = state

    const onConnect = async () => {
      const Web3Modal = (await import('web3modal')).default
      const network = chainIdToNetwork[selectedChainId]

      const web3Modal = new Web3Modal({
        network,
        cacheProvider: false,
        providerOptions: await getProviderOptions(network),
      })
      const provider = await web3Modal.connect()

      // await this.subscribeProvider(provider)

      const ethersProvider = new ethers.providers.Web3Provider(provider)

      const signer = await ethersProvider.getSigner()

      const address = await signer.getAddress()

      const chainId = await signer.getChainId()

      dispatch({
        type: 'batchChange',
        payload: {
          connected: true,
          address,
          chainId,
          signer,
          provider: ethersProvider,
        },
      })
    }

    const onSwap = async () => {
      const {
        fromAddress,
        toAddress,
        fromAmount,
        signer,
        chainId,
        address,
      } = state
      const fromDecimals = getBaseTokenDecimals(fromAddress, chainId)

      // Fetching for 1 unit of token
      const decimalAmount = fromAmount * Math.pow(10, fromDecimals)
      dispatch({
        type: 'batchChange',
        payload: {
          loading: true,
        },
      })
      //console.log(globalData["tx"]);                    //log the data
      try {
        const swapCalldata = await OneInchService.getSwapCalldata(
          selectedChainId,
          {
            fromTokenAddress: fromAddress,
            toTokenAddress: toAddress,
            amount: decimalAmount.toString(),
            fromAddress: address,
          },
        )

        const transaction = await signer.sendTransaction(swapCalldata['tx'])
        const explorerUrl = `https://${chainInfo[selectedChainId].explorerUrl}/tx/${transaction.hash}`
        dispatch({
          type: 'batchChange',
          payload: {
            loading: false,
            flash: `Transaction Sent. You can track the status <a href="${explorerUrl}" target="_blank">here</a>`,
            flashType: FlashTypes.Success,
          },
        })
      } catch (e) {
        dispatch({
          type: 'batchChange',
          payload: {
            flash: e.message,
            flashType: FlashTypes.Error,
            loading: false,
          },
        })
      }
    }

    const getSwapButtonText = () => {
      if (state.connected) {
        if (insufficientFunds) {
          return 'Insufficient Funds'
        }
        if (state.chainId != selectedChainId) {
          return 'Change Network to Swap'
        }
        if (loading) {
          return 'Loading'
        }
        return 'Swap'
      } else {
        return 'Connect To Swap'
      }
    }

    return (
      <Button
        variant="contained"
        color="primary"
        type="submit"
        style={{ width: '100%' }}
        disabled={insufficientFunds || loading}
        onClick={state.connected ? onSwap : onConnect}
      >
        <span style={{ color: 'white' }}>{getSwapButtonText()}</span>
      </Button>
    )
  }

  const SmallQuote = () => {
    const { fromName, toName, loadingQuote } = state
    const displayName = base_tokens[chainId][fromName]['display']

    return loadingQuote ? (
      <span>
        1 {toName} = <CircularProgress size={'10px'} /> {displayName}
      </span>
    ) : (
      <span>
        1 {toName} = {oneUnitFromAmount} {displayName}
      </span>
    )
  }

  useEffect(() => {
    dispatch({
      type: 'batchChange',
      payload: {
        fromAmount: 1,
      },
    })
    getConvertedValue(1, 'fromToken')
    ;(window as any).ethereum.on('chainChanged', chainId => {
      dispatch({
        type: 'batchChange',
        payload: {
          chainId,
        },
      })
    })
  }, [])

  useEffect(() => {
    if (
      state.tokenChanged == 'fromAmount' ||
      (prevState && prevState.fromAddress != state.fromAddress)
    ) {
      getConvertedValue(state.fromAmount, 'fromToken')
    }
    if (state.tokenChanged == 'toAmount') {
      getConvertedValue(state.toAmount, 'toToken')
    }
  }, [state.fromAddress, state.fromAmount, state.provider, state.toAmount])

  useEffect(() => {
    const updateTokenBalance = async (fromAddress, toAddress, options) => {
      const tokenBalance = await getBalance(fromAddress, options)
      const fromDecimals = getBaseTokenDecimals(fromAddress, chainId)
      const toTokenBalance = await getBalance(toAddress, options)
      const toDecimals = state.convertedQuoteDecimal

      dispatch({
        type: 'batchChange',
        payload: {
          fromAvailable: ethers.utils.formatUnits(tokenBalance, fromDecimals),
          toAvailable: ethers.utils.formatUnits(toTokenBalance, toDecimals),
        },
      })
    }

    if (state.provider && state.chainId == chainId) {
      updateTokenBalance(state.fromAddress, state.toAddress, {
        provider: state.provider,
        address: state.address,
      })
    }
  }, [state.provider, state.fromAddress])

  const insufficientFunds =
    state.connected &&
    parseFloat(state.fromAmount.toString()) >
      parseFloat(state.fromAvailable.toString())

  const swapableCurrencies = Object.keys(baseCurrencies)
    .filter(c => baseCurrencies[c].swapable)
    .reduce(
      (prevValue, currValue) => ({
        ...prevValue,
        [currValue]: baseCurrencies[currValue],
      }),
      {},
    )

  return (
    <Box mb={2} component="div">
      {state.flash && (
        <FlashComponent message={state.flash} flashType={state.flashType} />
      )}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item sm={6}>
          <Typography
            variant="body1"
            style={{ marginBottom: '8px', fontWeight: 600 }}
          >
            Swap
          </Typography>
        </Grid>
        <Grid item sm={6} style={{ textAlign: 'right', marginBottom: '8px' }}>
          <SwapSettings slippage={state.slippage} dispatch={dispatch} />
        </Grid>
      </Grid>
      <Paper
        className={clsx(classes.boxRoot, insufficientFunds && classes.error)}
      >
        <CurrencyComponent
          currencies={swapableCurrencies}
          selected={state.fromName}
          value={state.fromAmount}
          available={state.fromAvailable}
          changeCb={value => onTokenAmountChange(value, 'fromAmount')}
          tokenChangeCb={event => onTokenChangeHandler(event)}
        />
      </Paper>
      <Box className={classes.iconRoot}>
        <Avatar variant="rounded" className={classes.avatar}>
          <ArrowDownwardIcon fontSize="small" />
        </Avatar>
      </Box>
      <div>
        <Paper className={classes.boxRoot}>
          <CurrencyComponent
            currencies={targetCurrency}
            selected={name}
            value={state.toAmount}
            available={state.toAvailable}
            changeCb={value => onTokenAmountChange(value, 'toAmount')}
            tokenChangeCb={undefined}
          />
        </Paper>
      </div>
      <div className={classes.quote}>
        <SmallQuote />
      </div>
      <SwapButton selectedChainId={chainId} state={state} />
    </Box>
  )
}

export default SwapForm
