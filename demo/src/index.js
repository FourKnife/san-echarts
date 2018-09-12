import san from 'san';
import Echarts from '../../src/index';

const MyApp = san.defineComponent({
  template: `<div>
  <p>Hello {{name}}!</p>
  <button on-click="change">change data</button>
  <xui-echarts option="{{option}}" style="height: 350px; width: 100%; display: block"/>
  </div>`,

  initData() {
    return {
      name: 'San',
      option: this.optionFactory(),
    };
  },
  components: {
    'xui-echarts': Echarts,
  },
  change() {
    const option = this.optionFactory();
    this.data.set('option', option);
  },
  optionFactory: () => ({
    title: {
      text: '堆叠区域图',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['邮件营销', '联盟广告', '视频广告'],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '邮件营销',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [120, 132, 101, 134, 90, 230, 210 + parseInt(Math.random() * 100, 10) - 50],
      },
      {
        name: '联盟广告',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        stack: '总量',
        areaStyle: { normal: {} },
        data: [150, 232, 201, 154, 190, 330, 410],
      },
    ],
  }),
});


const myApp = new MyApp();
myApp.attach(document.body);
