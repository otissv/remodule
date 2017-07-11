'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = remodule;

var _toCamelCase = require('to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import register from './remodule-register';

function remodule(register) {
  function reduxMethods(register, method) {
    return function (fn) {
      return Object.keys(register).reduce(function (previousObj, currentKey) {
        var Class = currentKey !== 'initialState' && currentKey !== 'register' ? new register[currentKey]() : {};

        if (Class[method] == null) return previousObj;

        return fn({ previousObj: previousObj, currentKey: currentKey, method: method, Class: Class });
      }, {});
    };
  }

  var initialState = register.reduce(function (previousObj, currentModule) {
    return _extends({}, previousObj, _defineProperty({}, currentModule.register, currentModule.initialState));
  }, {});

  var actions = register.reduce(function (previous, current) {
    return _extends({}, previous, reduxMethods(current, 'action')(function (_ref) {
      var previousObj = _ref.previousObj,
          currentKey = _ref.currentKey,
          method = _ref.method,
          Class = _ref.Class;

      return _extends({}, previousObj, _defineProperty({}, (0, _toCamelCase2.default)(currentKey), Class[method]));
    }));
  }, {});

  var reducers = function reducers(extendReducers) {
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
      var action = arguments[1];

      var extendReducer = extendReducers ? Object.keys(extendReducers).reduce(function (previous, key) {
        return _extends({}, previous, extendReducers[key](state.form && state[key] || {}, action));
      }, {}) : {};

      return register.reduce(function (previous, currentModule) {
        var moduleName = currentModule.register;

        var reducer = function reducer(state, action) {
          var actions = reduxMethods(currentModule, 'reducer')(function (_ref2) {
            var previousObj = _ref2.previousObj,
                currentKey = _ref2.currentKey,
                method = _ref2.method,
                Class = _ref2.Class;

            return _extends({}, previousObj, _defineProperty({}, currentKey, Class[method](state, action)));
          });

          return actions[action.type] || state;
        };
        return _extends({}, previous, _defineProperty({}, moduleName, reducer(state[moduleName], action)));
      }, extendReducer);
    };
  };

  var store = function store(_ref3) {
    var middleware = _ref3.middleware,
        _ref3$extendReducers = _ref3.extendReducers,
        extendReducers = _ref3$extendReducers === undefined ? {} : _ref3$extendReducers;
    return _redux.compose.apply(undefined, _toConsumableArray(middleware))(_redux.createStore)(reducers(extendReducers));
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