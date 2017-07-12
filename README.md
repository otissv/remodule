# Remodule for Redux

**Taming Redux with modules.**

![logo](images/remodule.png)

Remodule works the same as [Redux](http://redux.js.org/) but removes the tedious task of organizing, splitting and collating files.

## Installation
npm install remodule

## Usage
Remodule uses ES6 class syntax to encapsulate actions and reducers inside a module.

```
export const register = 'core';
export const initialState = { loading: false }


export class Loading {
  action (bool) {
    return { type: 'Loading', payload: bool };
  }

  reducer (state, action) {
    return { ...state, loading: action.payload };
  }
}
```

These modules are then registered with remodule which returns a store, all actions, a combined reducer and maps all state to props. These can be passed to a connect function such as [react-redux](https://github.com/reactjs/react-redux).

Reducers take the name of class and can be called by any action in the app. Classes do not need to always a have action or reducer.

Initial state can also be added to in the module.



## Example
redux-app.js
```
export const register = 'core';

export const initialState = { 
  loading: false
}

export class RedirectTo {
  action (path) {
    browserHistory.push(path);

    return { type: 'DoNothing', payload: path };
  }
}

export class Loading {
  action (bool) {
    return { type: 'Loading', payload: bool };
  }

  reducer (state, action) {
    return { ...state, loading: action.payload };
  }
}
```


store.js
```
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as redux from 'react-redux';
import remodule from 'remodule';
import * as app from './redux-app';

const { actions, mapStateToProps, store } = remodule([
  // register modules here
  app
]);

import remodule from '../../remodule/dist/remodule';
export default store({
  middleware: [ applyMiddleware(thunk)]
});

export const connect = Component =>
  redux.connect(mapStateToProps, actions)(Component);
```

## License
MIT

