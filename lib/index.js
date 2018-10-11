"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _san = require("san");

var _echarts = _interopRequireDefault(require("echarts"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _sizeSensor = require("size-sensor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var pick = function pick(obj, keys) {
  var r = {};
  keys.forEach(function (key) {
    r[key] = obj[key];
  });
  return r;
};

var Echarts =
/*#__PURE__*/
function (_Component) {
  _inherits(Echarts, _Component);

  function Echarts() {
    _classCallCheck(this, Echarts);

    return _possibleConstructorReturn(this, _getPrototypeOf(Echarts).apply(this, arguments));
  }

  _createClass(Echarts, [{
    key: "initData",
    value: function initData() {
      return {
        target: undefined,
        notMerge: false,
        lazyUpdate: false,
        loadingOption: null,
        onEvents: {},
        style: {},
        theme: {}
      };
    }
  }, {
    key: "attached",
    value: function attached() {
      this.prevProps = {};
      this.echartsElement = this.ref('J_Echarts');
      this.render(this.data.get());
    }
  }, {
    key: "updated",
    value: function updated() {
      // 以下属性修改的时候，需要 dispose 之后再新建
      // 1. 切换 theme 的时候
      // 2. 修改 opts 的时候
      // 3. 修改 onEvents 的时候，这样可以取消所以之前绑定的事件 issue #151
      var props = this.data.get();
      var theme = props.theme,
          opts = props.opts,
          onEvents = props.onEvents;

      if (this.prevProps.theme !== theme || !(0, _fastDeepEqual.default)(this.prevProps.opts, opts) || !(0, _fastDeepEqual.default)(this.prevProps.onEvents, onEvents)) {
        this.dispose();
        this.render(props); // 重建

        return;
      } // 当这些属性保持不变的时候，不 setOption


      var pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];

      if ((0, _fastDeepEqual.default)(pick(props, pickKeys), pick(this.prevProps, pickKeys))) {
        return;
      } // 判断是否需要 setOption，由开发者自己来确定。默认为 true


      if (typeof props.shouldSetOption === 'function' && !props.shouldSetOption(this.prevProps, props)) {
        return;
      }

      var echartObj = this.renderEchartDom(); // 样式修改的时候，可能会导致大小变化，所以触发一下 resize

      if (!(0, _fastDeepEqual.default)(this.prevProps.style, props.style) || !(0, _fastDeepEqual.default)(this.prevProps.className, props.className)) {
        try {
          echartObj.resize();
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }, {
    key: "disposed",
    value: function disposed() {
      if (this.echartsElement) {
        try {
          (0, _sizeSensor.clear)(this.echartsElement);
        } catch (e) {
          console.warn(e);
        } // dispose echarts instance


        _echarts.default.dispose(this.echartsElement);
      }
    }
  }, {
    key: "render",
    value: function render(props) {
      this.prevProps = props;

      var _this$data$get = this.data.get(),
          onEvents = _this$data$get.onEvents,
          onChartReady = _this$data$get.onChartReady;

      var echartObj = this.renderEchartDom();
      this.bindEvents(echartObj, onEvents || {});

      if (typeof onChartReady === 'function') {
        onChartReady(echartObj);
      }

      if (this.echartsElement) {
        (0, _sizeSensor.bind)(this.echartsElement, function () {
          try {
            echartObj.resize();
          } catch (e) {
            console.warn(e);
          }
        });
      }
    }
  }, {
    key: "renderEchartDom",
    value: function renderEchartDom() {
      var instance = this.getEchartsInstance();
      instance.setOption(this.data.get('option'), this.data.get('notMerge'), this.data.get('lazyUpdate'));

      if (this.data.get('showLoading')) {
        instance.showLoading(this.data.get('loadingOption'));
      } else {
        instance.hideLoading();
      }

      return instance;
    }
  }, {
    key: "getEchartsInstance",
    value: function getEchartsInstance() {
      return _echarts.default.getInstanceByDom(this.echartsElement) || _echarts.default.init(this.echartsElement, this.data.get('theme'), this.data.get('opts'));
    }
  }, {
    key: "bindEvents",
    value: function bindEvents(instance, events) {
      var bindEvt = function bindEvt(eventName, func) {
        // ignore the event config which not satisfy
        if (typeof eventName === 'string' && typeof func === 'function') {
          // binding event
          // instance.off(eventName); // 已经 dispose 在重建，所以无需 off 操作
          instance.on(eventName, function (param) {
            func(param, instance);
          });
        }
      }; // loop and bind


      for (var eventName in events) {
        if (Object.prototype.hasOwnProperty.call(events, eventName)) {
          bindEvt(eventName, events[eventName]);
        }
      }
    }
  }]);

  return Echarts;
}(_san.Component);

Echarts.prototype.template = "\n<template>\n  <div class=\"ss\" s-ref=\"J_Echarts\" style=\"{{newStyle}}\">\n  </div>\n  </template>\n";
Echarts.prototype.computed = {
  newStyle: function newStyle() {
    var newStyle = {};
    var style = this.data.get('style');
    style.split(';').map(function (item) {
      var _item$split$map = item.split(':').map(function (elem) {
        return elem.trim();
      }),
          _item$split$map2 = _slicedToArray(_item$split$map, 2),
          key = _item$split$map2[0],
          value = _item$split$map2[1];

      newStyle[key] = value;
    });
    return _objectSpread({
      height: '300px'
    }, newStyle);
  }
};
Echarts.prototype.filters = {
  join: function join(obj, char) {
    var keys = Object.keys(obj);
    return keys.map(function (key) {
      return "".concat(key, ":").concat(obj[key]);
    }).join(char);
  }
};
var _default = Echarts;
exports.default = _default;