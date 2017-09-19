# Remodule for Redux

**Redux for lazy people**

![logo](https://raw.githubusercontent.com/otissv/remodule/master/src/images/remodule.png)

Warning! Do not read this article if you do not like an easier life.  

Stop now if you enjoy any of following:

- Lots of boilerplate
- Doing the same thing in 3 different places
- Creating lots of action creators and reducers
- Splitting state management across multiple files and forgetting what is where
- Missing out a step when setting up state

If on the other hand you want to get on building your app to get to MVP as quickly as possible then please read on.

## What is Remodule
Remodule is Redux, but removes the tedious tasks of organizing, splitting and collating files. Also does away with the need for constants and creating actions and reducers. Remodule is simply a pattern to encapsulate actions and reducers into modules.

Remodule can be installed via npm
```
npm install remodule
```

For the seriously lazy skip to the Seriously Super Lazy Redux section below.

### Modules
Remodule uses ES6 class syntax to encapsulate standard actions and reducers inside a classes. Actions and reducers inherit the name of their class in camel case. Actions and reducers can then be passed to a connect or store function such as in react-redux.

Just as in Redux actions return a type and a payload. The action type is the name of the reducers module of the state that will be updated. This does not need to be in the same module. Classes do not need to always a have action or reducer. Initial state can also be added to in the module.

### Register
Each module file is imported into the remoule function and Remodule then maps all the actions to props, combines all the reducers and creates the redux store automatically.

##Example
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


## Seriously Super Lazy Redux
For the majority of use cases Redux is used to as a simple getter and setter. If that is the case you can pass an initial true option to the remodule function. This will create actions and reducers for all modules as well as actions and reducers for all initialStates properties. The initialStates properties are prefixed with the module name as means of namespacing.

Heres how it redux-app.js now.
redux-app.js
```
export const register = 'core';

export const initialState = { 
  loading: false
}
```


As above you can still add your own Remodule modules. But, there will already be an action setCoreLoading.

If like me you love redux but are too lazy for all that boilerplate then Remodule is for you.
## Development
```
npm install
npm start
```

## License
MIT

