import { createElement } from 'react'
import ReactDOM from 'react-dom'
import loader from './loader'
import { Configurations } from './configurations'
import { App } from './App'

/**
 * Default configurations that are overridden by
 * parameters in embedded script.
 */
const defaultConfig: Configurations = {
  debug: false,
  minimized: false,
  disableDarkMode: false,
  text: {},
  styles: {},
  elementId: 'swapButton',
  token: {},
}

// main entry point - calls loader and render Preact app into supplied element
loader(window, defaultConfig, window.document.currentScript, (el, config) =>
  ReactDOM.render(createElement(App, { ...config, element: el }), el),
)
