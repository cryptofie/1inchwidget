import React, { useRef, useEffect, useState } from 'react'
import {
  Theme,
  Button,
  Paper,
  ButtonGroup,
  makeStyles,
} from '@material-ui/core'

import InputBase from '@material-ui/core/InputBase'
import createStyles from '@material-ui/styles/createStyles'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textFieldRoot: {
      flex: 1,
      display: 'flex',
    },
    inputStyle: {
      textAlign: 'right',
    },
    available: {
      color: theme.palette.grey[600],
      marginBottom: theme.spacing(1),
      float: 'right',
      fontWeight: 'bold',
      fontSize: 10,
    },
  }),
)

const CurrencyComponent = ({
  currencies,
  selected,
  value,
  available,
  changeCb,
  tokenChangeCb,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const currencyNames = Object.keys(currencies).map(
    c => currencies[c].display || c,
  )

  useEffect(() => {
    const index = currencyNames.findIndex(val => val == selected)

    if (index !== -1) {
      setSelectedIndex(index)
    }
  }, [selected])

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index)
    setOpen(false)
    tokenChangeCb(_event)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const onValueChangeHandler = event => {
    const value = event.target.value || 1

    changeCb(value)
  }

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button color="primary" disabled={currencyNames.length <= 1}>
          {currencyNames[selectedIndex]}
        </Button>
        {currencyNames.length > 1 && (
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        )}
      </ButtonGroup>
      {currencyNames.length > 1 && (
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{ zIndex: 100 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {currencyNames.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
      <div style={{ textAlign: 'right', width: '100%' }}>
        <InputBase
          id="outlined-basic"
          placeholder="100.0"
          classes={{ root: classes.textFieldRoot, input: classes.inputStyle }}
          onChange={onValueChangeHandler}
          value={value}
        />
        <div className={classes.available}>{`Balance: ${parseFloat(
          available,
        ).toFixed(6)}`}</div>
      </div>
    </>
  )
}

export default CurrencyComponent
