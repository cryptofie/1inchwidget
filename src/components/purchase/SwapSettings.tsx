import React from 'react'

import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import {
  createStyles,
  InputAdornment,
  Theme,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from '@material-ui/core/IconButton'
import { ClickAwayListener } from '@material-ui/core'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slippageRoot: {
      width: theme.spacing(10),
      fontSize: '1rem',
    },
    paper: {
      padding: theme.spacing(2),
      width: 200,
    },
    settingsRoot: {
      paddingRight: 0,
    },
    popover: {
      pointerEvents: 'none',
    },
    iconButtonRoot: {
      padding: 0,
    },
  }),
)

const SwapSettings = ({ slippage, dispatch }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    if (anchorEl) {
      setAnchorEl(null)
    }
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton
        onClick={handlePopoverOpen}
        classes={{ root: classes.iconButtonRoot }}
      >
        <SettingsIcon classes={{ root: classes.settingsRoot }} />
      </IconButton>
      <div>
        <Popper
          placement="bottom-end"
          disablePortal={false}
          open={open}
          anchorEl={anchorEl}
        >
          <ClickAwayListener onClickAway={handlePopoverClose}>
            <Paper classes={{ root: classes.paper }}>
              <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                Transaction Settings
              </Typography>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item component="span">
                  <Typography variant="body2">Slippage</Typography>
                </Grid>
                <Grid item component="span">
                  <TextField
                    value={slippage}
                    classes={{ root: classes.slippageRoot }}
                    variant="outlined"
                    size="small"
                    onChange={ev =>
                      dispatch({
                        type: 'batchChange',
                        payload: {
                          slippage: ev.target.value,
                        },
                      })
                    }
                    inputProps={{
                      style: { paddingTop: '4px', paddingBottom: '4px' },
                    }}
                    InputProps={{
                      margin: 'dense',
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body1">%</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </div>
    </>
  )
}

export default SwapSettings
