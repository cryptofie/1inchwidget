import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Edit from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: 'black',
      fontSize: 12,
      opacity: 1,
      borderBottom: 0,
      '&:before': {
        borderBottom: 0,
      },
    },
    disabled: {
      color: 'black',
      borderBottom: 0,
      '&:before': {
        borderBottom: 0,
      },
    },
    root: {
      fontSize: 12,
      width: theme.spacing(7),
      fontWeight: 'bold',
    },
    btnIcons: {
      marginLeft: 10,
    },
  }),
)

const EditableTextField = ({ defaultValue }) => {
  const [state, setState] = useState({
    val: defaultValue,
    editMode: false,
    mouseOver: false,
  })

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const handleMouseOver = event => {
    if (!state.mouseOver) {
      setState({ ...state, mouseOver: true })
    }
  }

  const handleMouseOut = event => {
    // The problem is here!!!
    if (state.mouseOver) {
      setState({ ...state, mouseOver: false })
    }
  }

  const handleClick = () => {
    setState({ ...state, editMode: true, mouseOver: false })
  }

  const classes = useStyles()

  return (
    <div className={classes.container}>
      <TextField
        name="email"
        defaultValue={defaultValue}
        error={state.val === ''}
        onChange={handleChange}
        disabled={!state.editMode}
        className={classes.textField}
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
        size="small"
        InputProps={{
          classes: {
            disabled: classes.disabled,
            root: classes.root,
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClick}>
                <Edit style={{ fontSize: 12 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  )
}

export default EditableTextField
