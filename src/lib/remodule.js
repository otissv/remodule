import camel from 'to-camel-case';
import { compose, createStore } from 'redux';

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

function typeName (str) {
  return `set${str}`;
}

function capitalize (str) {
  return `${str[0].toUpperCase()}${str.substr(1, str.length - 1)}`;
}

export default function remodule (register, { initial }) {
  const initialState = register.reduce(
    (previousObj, currentModule) => ({
      ...previousObj,
      [currentModule.register]: currentModule.initialState
    }),
    {}
  );

  const initialActions = Object.keys(initialState)
    .reduce(
      (previous, mod) => [
        ...previous,
        capitalize(mod),
        ...Object.keys(initialState[mod]).map(
          item => `${capitalize(mod)}${capitalize(item)}`
        )
      ],
      []
    )
    .reduce(
      (previous, key) => ({
        ...previous,
        [typeName(key)]: payload => ({ type: typeName(key), payload })
      }),
      {}
    );

  const initialReducers = Object.keys(initialState).reduce(
    (previous, mod) => ({
      ...previous,
      [typeName(capitalize(mod))]: (state, action) => {
        console.log(state);
        return {
          ...state,
          ...action.payload
        };
      },

      ...Object.keys(initialState[mod]).reduce((prev, key) => {
        const type = typeName(`${capitalize(mod)}${capitalize(key)}`);

        return {
          ...prev,
          [type]: (state, action) => {
            console.log(action.type, action.payload);
            if (type !== action.type) return state[mod];
            return typeof action.payload === 'object'
              ? { ...state, [key]: { ...action.payload } }
              : { ...state, [key]: action.payload };
          }
        };
      }, {})
    }),
    {}
  );

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
  }, initial ? initialActions : {});

  const reducers = (state = initialState, action) => {
    return register.reduce((previous, currentModule) => {
      const moduleName = currentModule.register;

      const reducer = (state, action) => {
        const actions = reduxMethods(
          currentModule,
          'reducer'
        )(({ previousObj, currentKey, method, Class }) => {
          return {
            ...previousObj,
            [camel(currentKey)]: (state, action) =>
              action.type === currentKey && Class[method](state, action)
          };
        });
        const type = camel(action.type);
        const setModuleName = `set${capitalize(moduleName)}`.trim();

        if (actions[type] == null) {
          const modType =
            type.substr(0, `set${moduleName}`.length) === setModuleName &&
            type !== setModuleName
              ? camel(type.substr(setModuleName.length, type.length - 1))
              : camel(type.substr(3, type.length - 1));

          if (
            state[modType] ||
            (state[modType] === '' && initialReducers[action.type])
          ) {
            return initialReducers[action.type](state, action);
          } else if (moduleName == modType) {
            return initialReducers[action.type](state, action);
          } else {
            return state;
          }
        } else {
          return actions[type](state, action);
        }
      };

      return {
        ...previous,
        [moduleName]: {
          ...previous[moduleName],
          ...reducer(state[moduleName], action)
        }
      };
    }, {});
  };

  const store = ({ middleware, extendReducers = {} }) =>
    compose(...middleware)(createStore)(reducers);

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
