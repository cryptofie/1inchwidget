import React from 'react'

import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const FlashComponent = ({ message, flashType }) => {
  return (
    <Box mt={1} mb={1}>
      <Alert severity={flashType}>
        <div dangerouslySetInnerHTML={{ __html: message }}></div>
      </Alert>
    </Box>
  )
}

export default FlashComponent
