import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { AppConfigurations, Globals } from './configurations'

export const ConfigContext = createContext<AppConfigurations>(
  {} as AppConfigurations,
)

export const GlobalsContext = createContext<Globals>({
  widgetOpen: false,
  setWidgetOpen: () => undefined,
})

interface Props {
  children: ReactNode
  config: AppConfigurations
  element?: HTMLElement
}
export const AppContext = ({ children, config, element }: Props) => {
  const [widgetOpen, setWidgetOpen] = useState(!config.minimized)
  useEffect(() => {
    element?.addEventListener(
      'widget-event',
      (e: CustomEvent<{ name?: string }>) => {
        switch (e.detail.name) {
          case 'open':
            setWidgetOpen(true)
            break
          case 'close':
            setWidgetOpen(false)
            break
        }
      },
    )
  }, [element])

  return (
    <ConfigContext.Provider value={config}>
      <GlobalsContext.Provider value={{ widgetOpen, setWidgetOpen }}>
        {children}
      </GlobalsContext.Provider>
    </ConfigContext.Provider>
  )
}
