import React, { useContext } from 'react'
import { createPortal } from 'react-dom'

import { Configurations } from './configurations'
import { AppContext, ConfigContext } from './AppContext'

import Purchase from './purchase'

type Props = Configurations
export const App = ({ element, ...appSettings }: Props) => {
  // const openNotification = placement => {
  //   notification.open({
  //     message: `Free Share Investment Account with Zerodha`,
  //     description: <Purchase />,
  //     placement,
  //     duration: 0,
  //   })
  // }

  // useEffect(() => {
  //   openNotification('bottomRight')
  // }, [])

  return (
    <div>
      <AppContext config={appSettings} element={element}>
        <PurchasePortal />
      </AppContext>
    </div>
  )
}

const PurchasePortal = () => {
  const config = useContext(ConfigContext)

  return createPortal(<Purchase />, document.getElementById(config.elementId))
}
