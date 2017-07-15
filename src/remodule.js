import camel from 'to-camel-case';
import { compose, createStore } from 'redux';


export default function remodule (register) {
  function reduxMethods (register, method) {
    return function (fn) {
      return Object.keys(register).reduce((previousObj, currentKey) => {
        let Class =
          currentKey !== 'initialState' && currentKey !== 'register'
            ? new register[currentKey]()
            : {};

        if (Class[method] == null) return previousObj;

        return fn({ previousObj, currentKey, method, Class });
      }, {});
    };
  }

  const initialState = register.reduce((previousObj, currentModule) => {
    return {
      ...previousObj,
      [currentModule.register]: currentModule.initialState
    };
  }, {});

  const actions = register.reduce((previous, current) => {
    return {
      ...previous,
      ...reduxMethods(
        current,
        'action'
      )(({ previousObj, currentKey, method, Class }) => {
        return {
          ...previousObj,
          [camel(currentKey)]: Class[method]
        };
      })
    };
  }, {});

  const reducers = extendReducers => (state = initialState, action) => {
    const extendReducer = extendReducers
      ? Object.keys(extendReducers).reduce(
          (previous, key) => ({
            ...previous,
            ...extendReducers[key]((state.form && state[key]) || {}, action)
          }),
          {}
        )
      : {};

    return register.reduce((previous, currentModule) => {
      const moduleName = currentModule.register;

      const reducer = (state, action) => {
        const actions = reduxMethods(
          currentModule,
          'reducer'
        )(({ previousObj, currentKey, method, Class }) => {
          return {
            ...previousObj,
            [currentKey]: Class[method](state, action)
          };
        });

        return actions[action.type] || state;
      };
      return {
        ...previous,
        [moduleName]: reducer(state[moduleName], action)
      };
    }, extendReducer);
  };

  const store = ({ middleware, extendReducers = {} }) =>
    compose(...middleware)(createStore)(reducers(extendReducers));

  const mapStateToProps = state => {
    return register.reduce((previousObj, currentModule) => {
      const moduleName = currentModule.register;

      return {
        ...previousObj,
        initialState,
        ...Object.keys(
          currentModule.initialState
        ).reduce((previous, currentKey) => {
          return {
            ...previous,
            [currentKey]: state[moduleName][currentKey]
          };
        }, {})
      };
    }, {});
  };

  return {
    actions,
    initialState,
    mapStateToProps,
    reducers,
    store
  };
}
