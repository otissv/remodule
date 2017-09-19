'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = remodule;

var _toCamelCase = require('to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function reduxMethods(register, method) {
  return function (fn) {
    return Object.keys(register).reduce(function (previousObj, currentKey) {
      var Class = currentKey !== 'initialState' && currentKey !== 'register' ? new register[currentKey]() : {};

      if (Class[method] == null) return previousObj;

      return fn({ previousObj: previousObj, currentKey: currentKey, method: method, Class: Class });
    }, {});
  };
}

function typeName(str) {
  return 'set' + str;
}

function capitalize(str) {
  return '' + str[0].toUpperCase() + str.substr(1, str.length - 1);
}

function remodule(register, _ref) {
  var initial = _ref.initial;

  var initialState = register.reduce(function (previousObj, currentModule) {
    return _extends({}, previousObj, _defineProperty({}, currentModule.register, currentModule.initialState));
  }, {});

  var initialActions = Object.keys(initialState).reduce(function (previous, mod) {
    return [].concat(_toConsumableArray(previous), [capitalize(mod)], _toConsumableArray(Object.keys(initialState[mod]).map(function (item) {
      return '' + capitalize(mod) + capitalize(item);
    })));
  }, []).reduce(function (previous, key) {
    return _extends({}, previous, _defineProperty({}, typeName(key), function (payload) {
      return { type: typeName(key), payload: payload };
    }));
  }, {});

  var initialReducers = Object.keys(initialState).reduce(function (previous, mod) {
    return _extends({}, previous, _defineProperty({}, typeName(capitalize(mod)), function (state, action) {
      console.log(state);
      return _extends({}, state, action.payload);
    }), Object.keys(initialState[mod]).reduce(function (prev, key) {
      var type = typeName('' + capitalize(mod) + capitalize(key));

      return _extends({}, prev, _defineProperty({}, type, function (state, action) {
        console.log(action.type, action.payload);
        if (type !== action.type) return state[mod];
        return _typeof(action.payload) === 'object' ? _extends({}, state, _defineProperty({}, key, _extends({}, action.payload))) : _extends({}, state, _defineProperty({}, key, action.payload));
      }));
    }, {}));
  }, {});

  var actions = register.reduce(function (previous, current) {
    return _extends({}, previous, reduxMethods(current, 'action')(function (_ref2) {
      var previousObj = _ref2.previousObj,
          currentKey = _ref2.currentKey,
          method = _ref2.method,
          Class = _ref2.Class;

      return _extends({}, previousObj, _defineProperty({}, (0, _toCamelCase2.default)(currentKey), Class[method]));
    }));
  }, initial ? initialActions : {});

  var reducers = function reducers() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    return register.reduce(function (previous, currentModule) {
      var moduleName = currentModule.register;

      var reducer = function reducer(state, action) {
        var actions = reduxMethods(currentModule, 'reducer')(function (_ref3) {
          var previousObj = _ref3.previousObj,
              currentKey = _ref3.currentKey,
              method = _ref3.method,
              Class = _ref3.Class;

          return _extends({}, previousObj, _defineProperty({}, (0, _toCamelCase2.default)(currentKey), function (state, action) {
            return action.type === currentKey && Class[method](state, action);
          }));
        });
        var type = (0, _toCamelCase2.default)(action.type);
        var setModuleName = ('set' + capitalize(moduleName)).trim();

        if (actions[type] == null) {
          var modType = type.substr(0, ('set' + moduleName).length) === setModuleName && type !== setModuleName ? (0, _toCamelCase2.default)(type.substr(setModuleName.length, type.length - 1)) : (0, _toCamelCase2.default)(type.substr(3, type.length - 1));

          if (state[modType] || state[modType] === '' && initialReducers[action.type]) {
            return initialReducers[action.type](state, action);
          } else if (moduleName === modType) {
            return initialReducers[action.type](state, action);
          } else {
            return state;
          }
        } else {
          return actions[type](state, action);
        }
      };

      return _extends({}, previous, _defineProperty({}, moduleName, _extends({}, previous[moduleName], reducer(state[moduleName], action))));
    }, {});
  };

  var store = function store(_ref4) {
    var middleware = _ref4.middleware,
        _ref4$extendReducers = _ref4.extendReducers,
        extendReducers = _ref4$extendReducers === undefined ? {} : _ref4$extendReducers;
    return _redux.compose.apply(undefined, _toConsumableArray(middleware))(_redux.createStore)(reducers);
  };

  var mapStateToProps = function mapStateToProps(state) {
    return register.reduce(function (previousObj, currentModule) {
      var moduleName = currentModule.register;

      return _extends({}, previousObj, {
        initialState: initialState
      }, Object.keys(currentModule.initialState).reduce(function (previous, currentKey) {
        return _extends({}, previous, _defineProperty({}, currentKey, state[moduleName][currentKey]));
      }, {}));
    }, {});
  };

  return {
    actions: actions,
    initialState: initialState,
    mapStateToProps: mapStateToProps,
    reducers: reducers,
    store: store
  };
}
//# sourceMappingURL=remodule.js.map