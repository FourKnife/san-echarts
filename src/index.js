import { Component } from 'san';
import echarts from 'echarts';
import isEqual from 'fast-deep-equal';
import { bind, clear } from 'size-sensor';

const pick = (obj, keys) => {
  const r = {};
  keys.forEach((key) => {
    r[key] = obj[key];
  });
  return r;
};

class Echarts extends Component {
  initData() {
    return {
      target: undefined,
      notMerge: false,
      lazyUpdate: false,
      loadingOption: null,
      onEvents: {},
    };
  }

  attached() {
    this.prevProps = {};
    this.echartsElement = this.ref('J_Echarts');
    this.render();
  }

  updated() {
    // 以下属性修改的时候，需要 dispose 之后再新建
    // 1. 切换 theme 的时候
    // 2. 修改 opts 的时候
    // 3. 修改 onEvents 的时候，这样可以取消所以之前绑定的事件 issue #151
    const props = this.data.get();
    const { theme, opts, onEvents } = props;
    if (
      this.prevProps.theme !== theme
      || !isEqual(this.prevProps.opts, opts)
      || !isEqual(this.prevProps.onEvents, onEvents)
    ) {
      this.dispose();

      this.render(props); // 重建
      return;
    }

    // 当这些属性保持不变的时候，不 setOption
    const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
    if (isEqual(pick(props, pickKeys), pick(this.prevProps, pickKeys))) {
      return;
    }

    // 判断是否需要 setOption，由开发者自己来确定。默认为 true
    if (typeof props.shouldSetOption === 'function' && !props.shouldSetOption(this.prevProps, props)) {
      return;
    }

    const echartObj = this.renderEchartDom();
    // 样式修改的时候，可能会导致大小变化，所以触发一下 resize
    if (!isEqual(this.prevProps.style, props.style)
      || !isEqual(this.prevProps.className, props.className)) {
      try {
        echartObj.resize();
      } catch (e) {
        console.warn(e);
      }
    }
  }

  dispose() {

  }

  render(props) {
    this.prevProps = props;
    const { onEvents, onChartReady } = this.data.get();

    const echartObj = this.renderEchartDom();
    this.bindEvents(echartObj, onEvents || {});

    if (typeof onChartReady === 'function') {
      onChartReady(echartObj);
    }

    if (this.echartsElement) {
      bind(this.echartsElement, () => {
        try {
          echartObj.resize();
        } catch (e) {
          console.warn(e);
        }
      });
    }
  }

  renderEchartDom() {
    const instance = this.getEchartsInstance();
    instance.setOption(this.data.get('option'), this.data.get('notMerge'), this.data.get('lazyUpdate'));
    if (this.data.get('showLoading')) {
      instance.showLoading(this.data.get('loadingOption'));
    } else {
      instance.hideLoading();
    }

    return instance;
  }

  getEchartsInstance() {
    return echarts.getInstanceByDom(this.echartsElement)
        || echarts.init(this.echartsElement, this.data.get('theme'), this.data.get('opts'));
  }

  bindEvents(instance, events) {
    const bindEvt = (eventName, func) => {
      // ignore the event config which not satisfy
      if (typeof eventName === 'string' && typeof func === 'function') {
        // binding event
        // instance.off(eventName); // 已经 dispose 在重建，所以无需 off 操作
        instance.on(eventName, (param) => {
          func(param, instance);
        });
      }
    };

    // loop and bind
    for (const eventName in events) {
      if (Object.prototype.hasOwnProperty.call(events, eventName)) {
        bindEvt(eventName, events[eventName]);
      }
    }
  }
}

Echarts.prototype.template = `
  <div s-ref="J_Echarts">
  </div>
`;

export default Echarts;
