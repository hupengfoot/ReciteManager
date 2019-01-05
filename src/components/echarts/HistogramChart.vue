<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      color:['#FF005A', '#3888fa', '#7B7B7B', '#FF0080', '#E800E8', '#921AFF', '#00E3E3', '#00EC00', '#E1E100', '#FF9224']
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    /*
        HistogramChartData : {
            xAxisData: [],
            yAxisData: [
                {
                    yName:"xxx",
                    yDataList: []
                },
                {
                    yName:"yyy",
                    yDataList: []
                }
            ]
        }
    */
    setOptions(HistogramChartData) {
      var labelOption = {
        normal: {
            show: true,
            position: 'insideBottom',
            distance: 15,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {
                    textBorderColor: '#fff'
                }
            }
        }
      };    
      
      let option = {
        color: [],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            //TODO 填写班级名称
            data: []
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                //TODO 填写题型
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        //TODO 填写数据
        series: [
        ]
      };
      for(let i in HistogramChartData.yAxisData){
          //填充颜色
          option.color.push(this.color[i]);
          //填充对比项
          option.legend.data.push(HistogramChartData.yAxisData[i].yName);
          //填充Y坐标
          let tempItem = {
            name: HistogramChartData.yAxisData[i].yName,
            type: 'bar',
            label: labelOption,
            data: HistogramChartData.yAxisData[i].yDataList
          }
          option.series.push(tempItem);
      }
      //填充X坐标
      option.xAxis[0].data = HistogramChartData.xAxisData;
      this.chart.setOption(option);    
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
