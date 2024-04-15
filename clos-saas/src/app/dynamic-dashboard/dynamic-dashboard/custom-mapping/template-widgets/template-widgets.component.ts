import { Component, Input, OnInit } from '@angular/core';
import { CustomiseDashboard } from '../../models/model';
import * as echarts from 'echarts';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-template-widgets',
  templateUrl: './template-widgets.component.html',
  styleUrls: ['./template-widgets.component.scss']
})
export class TemplateWidgetsComponent implements OnInit {

  customLayout = new CustomiseDashboard();
  option: any;
  @Input() widget: any;
  highcharts=Highcharts;

  constructor(
  ) { }

  ngOnInit() {
    this.widgetOptions();
  }

  widgetOptions(){
      let theme =''
      switch(this.widget){
        case "lineChart":
          this.option = {
            title:{
              text: 'LINE',
              left:'center',
              textStyle: {
                color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                fontSize: '10',
                fontWeight: 700
              }
            },
            xAxis: {
                type: 'category',
                data: ['', '', '']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
              data: [50, 200, 100],
              type: 'line',
              showBackground: true,
            }]
        };
          break;
        case "pieChart":
          this.option = {
            title:{
              text: 'PIE',
              left:'center',
              textStyle: {
                color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                fontSize: '10',
                fontWeight: 700
              }
            },
            series: [
                {
                    name: 'Pie',
                    type: 'pie',
                    radius: '65%',
                    label: {
                      show: false,
                    },
                    data: [
                        {value: 108, name: 'Sample1'},
                        {value: 735, name: 'Sample2'},
                        {value: 580, name: 'Sample3'},
                        {value: 484, name: 'Sample4'},
                        {value: 300, name: 'Sample5'}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                        }
                    }
                }
            ]
        };
          break;
        case "gaugeChart":
          this.option ={
            title: {
            show: true,
            text:'GAUGE',
            top:-4,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
              fontSize: '10',
              fontWeight: 700
            },
            label: {
              fontSize:'10',
            },
            left:'center'
          },
          series: [{
            top:-10,
            type: 'gauge',
            progress: {
                show: true,
                width: 10
            },
            axisLine: {
                lineStyle: {
                    width: 7
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
              show:false,
            },
            axisLabel: {
              show:false,
            },
            anchor: {
                show: true,
                showAbove: true,
                size: 10,
                itemStyle: {
                    borderWidth: 4
                }
            },
            detail: {
                valueAnimation: true,
                fontSize: 10,
                offsetCenter: [0, '100%']
            },
            data: [{
                value: 90
            }]
          }]
          };
          break;
        case "donutChart":
          this.option = {
            title:{
              text: 'DONUT',
              left:'center',
              textStyle: {
                color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                fontSize: '10',
                fontWeight: 700
              }
            },
            series: [
                {
                    name: 'Pie',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    },
                      data: [
                          {value: 108, name: 'Sample1'},
                          {value: 735, name: 'Sample2'},
                          {value: 580, name: 'Sample3'},
                          {value: 484, name: 'Sample4'},
                          {value: 300, name: 'Sample5'}
                      ],
                }
            ]
        };
          break;
        case "funnelChart":
          this.option = {
            title:{
              text: 'FUNNEL',
              left:'center',
              textStyle: {
                color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                fontSize: '10',
                fontWeight: 700
              }
            },
            tooltip: {
              show: false,
              },
            series: [
              {
                name:'Funnel',
                type:'funnel',
                left: 'center',
                top: 25,
                // bottom: 60,
                width: '90%',
                height: '75%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 1,
                label: {
                    show: false,
                    position: 'inside'
                },
                labelLine: {
                    length: 20,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                      show: false,
                    }
                },
                data: [
                    {value: 60, name: 's1'},
                    {value: 40, name: 's2'},
                    {value: 20, name: 's3'}
                ]
            }
            ]
        };
          break;
        case "barChart":
          this.option = {
            title:{
              text: 'BAR',
              left:'center',
              textStyle: {
                color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                fontSize: '10',
                fontWeight: 700
              }
            },
            xAxis: {
                type: 'category',
                data: ['', '', '']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [50, 200, 100],
                type: 'bar',
                showBackground: true,
            itemStyle: {
              // color: 'rgb(7, 148, 173)',
            }, 
            }]
          };
          break; 
          case "multipleChart":
            this.option = {
              title:{
                text: 'MULTIPLE Y AXIS',
                left:'center',
                textStyle: {
                  color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                  fontSize: '10',
                  fontWeight: 700
                }
              },
              xAxis: {
                  type: 'category',
                  data: ['', '', '']
              },
              yAxis: {
                  type: 'value'
              },
              series: [
                {
                  data: [50, 200, 100],
                  type: 'bar'
              },
              {
                data: [20, 200, 10],
                type: 'bar'
            },
              {
                data: [25, 10, 75],
                type: 'line'
              }
            ]
            };
            break;
          case "candleStick":{
            this.option={
                title:{
                  text: 'CANDLE-STICK',
                  left:'center',
                  textStyle: {
                    color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'black',
                    fontSize: '10',
                    fontWeight: 700
                  }
                },
                xAxis: {
                  data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
                },
                yAxis: {},
                series: [
                  {
                    type: 'candlestick',
                    data: [
                      [20, 34, 10, 38],
                      [40, 35, 30, 50],
                      [31, 38, 33, 44],
                      [38, 15, 5, 42]
                    ]
                  }
                ]
            }
            break;
          }
      }

    }

}
