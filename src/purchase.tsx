// import { useEffect } from 'react'
import React, { useContext } from 'react'
import { Fade, Paper, Theme, ThemeProvider } from '@material-ui/core'

import { createStyles, makeStyles } from '@material-ui/styles'
import { widgetTheme } from 'theme'
import PurchaseButton from './components/purchase/Button'
import { ConfigContext } from './AppContext'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'gray',
      width: '50%',
      maxWidth: '600px',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 3, 2),
      borderRadius: theme.spacing(1),
    },
    form: {
      display: 'flex',
    },
  }),
)

const Purchase = props => {
  // if (typeof window === 'undefined') {
  //   return null
  // }

  //useEffect(() => {}, [])

  console.log('props', props)

  return (
    // <Paper
    //   elevation={24}
    //   variant="outlined"
    //   style={{ position: 'fixed', bottom: '20px', right: '20px' }}
    // >
    //   <Grid direction="row">
    //     <SwapForm />
    //     <PurchaseButton chainId={56} network={'binance'} networkId={56} />
    //   </Grid>
    // </Paper>
    <ThemeProvider theme={widgetTheme}>
      <ThemedModal />
    </ThemeProvider>
  )
}

const ThemedModal = () => {
  const classes = useStyles()
  const config = useContext(ConfigContext)

  const {
    token: { chainId, address, name },
  } = config

  return (
    <>
      <Paper
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        classes={{
          root: classes.root,
        }}
        // onClose={handleClose}
        style={{ position: 'fixed', bottom: '16px', right: '16px' }}
      >
        <Fade in={true}>
          <div className={classes.paper}>
            {/* <SwapForm /> */}
            <PurchaseButton chainId={chainId} address={address} name={name} />
          </div>
        </Fade>
      </Paper>
    </>
  )
}

export default Purchase
