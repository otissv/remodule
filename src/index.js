import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  // Wrap App inside Redux provider and add the store
  <Provider store={store}>
    <App title="Welcome to React" />
  </Provider>,
  // add app to DOM
  document.getElementById('root')
);
registerServiceWorker();
