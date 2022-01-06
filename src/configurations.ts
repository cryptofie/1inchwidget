interface InfraConfigurations {
  element?: HTMLElement
}

/**
 * A model representing all possible configurations
 * that can be done from embedded script. Those settings
 * are passed around in application via Context.
 */
export interface AppConfigurations {
  debug: boolean
  minimized: boolean
  disableDarkMode: boolean
  elementId: string
  text: {
    minimizedTitle?: string
    formTitle?: string
    formSubTitle?: string
    thankYouTitle?: string
    thankYouBody?: string
    faqTitle?: string
    buttonTitle?: string
  }
  styles: {
    classNameContainer?: string
  }
  token: {
    name?: string
    address?: string
    amount?: string
    chainId?: number
  }
}

export type Configurations = InfraConfigurations & AppConfigurations

export interface Globals {
  widgetOpen: boolean
  setWidgetOpen: (open: boolean) => void
}
