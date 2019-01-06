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
    //TODO 修改setOptions改变传入参数
    /*
      lineChartData:{
        xAxisData: [],
        yAxisData : [
          {
            yName: "xxx",
            yDataList : [],
          },
          {
            yName: "yyy",
            yDataList : []
          }
        ]
      }
     
    */
    setOptions(lineChartData) {
      let legendData = [];
      let seriesData = [];
      for(let i in lineChartData.yAxisData){
        legendData.push(lineChartData.yAxisData[i].yName);
        let tempData = {
          name: lineChartData.yAxisData[i].yName, 
          itemStyle: {
            normal: {
              color: this.color[i],
              lineStyle: {
                color: this.color[i],
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: lineChartData.yAxisData[i].yDataList,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        };
        seriesData.push(tempData);
      }
      
      this.chart.setOption({
        xAxis: {
          data: lineChartData.xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: legendData
        },
        series: seriesData
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
