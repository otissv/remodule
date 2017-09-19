import React from 'react';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as redux from 'react-redux';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import remodule from './lib/remodule';
import * as module1 from './modules/module1';
import * as module2 from './modules/module2';

// add redux devtools
const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m"
  />
);

// build actions, mapStateToProps and store from modules
const { actions, mapStateToProps, store } = remodule([module1, module2], {
  initial: true
});

// add middleware to store and export store
export default store({
  middleware: [
    applyMiddleware(thunk),
    window.devToolsExtension
      ? window.devToolsExtension()
      : DevTools.instrument()
  ]
});

// export redux connect higher order component
export const connect = Component =>
  redux.connect(mapStateToProps, actions)(Component);
