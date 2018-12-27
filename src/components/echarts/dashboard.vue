<template>
 <!-- <p :id="id" :style="style"></p> -->
 
 <div :id="id" :style="{width: '300px', height: '300px'}"></div>
</template>
<script>
export default {
  name: "Chart",
  data() {
      return {
        
      };
  },
  props: ['id','width','height','option'],

  mounted() {
    this.init();
  },
  methods: {
    init() {
      let myChart = this.$echarts.init(document.getElementById(this.id))
      myChart.setOption({
              tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          x: 'left',
          data:['直接访问','邮件营销']
      },
      series: [
          {
              name:'访问来源',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                  normal: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      show: true,
                      textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  }
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              data:this.option
          }
      ]
        });
    }
  }
};
</script>