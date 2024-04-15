import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  pie;
  bar;
  line;
  donut;
  funnel;
  gauge;
  widgetType: string;
  widgetSettings: boolean = false;
  multiple;
  candleStick:any;
  highcharts=Highcharts;
  //Component Height
	component_height: number;
	@HostListener('window:resize', ['$event'])
	updateComponentSize(event?) {
		this.component_height = window.innerHeight - app_header_height;
	}
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

  constructor(
    public jwtAuthenicationService: JwtAuthenticationService,
    public dialogRef: MatDialogRef<WidgetsComponent>,
    public dialog: MatDialog,
    private url: UrlService,
    media: MediaMatcher,
    // public crmService: CrmServiceService,
		changeDetectorRef: ChangeDetectorRef,
    // public adminDataService: ServiceService
  ) {
    this.updateComponentSize();
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
   }

   public updateUrl(): Promise < Object > {
    return this.url.getUrl().toPromise();
  }

   async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.pieGraph();
    this.gaugeGraph();
    this.donutGraph();
    this.funnelGraph();
    this.bargraph();
    this.lineGraph();
    this.multiplechart();
    this.candleStickGraph();
  } 

  // Widget Pie Graph 
  pieGraph(){
    let theme = 'theme-light'
    this.pie ={
      title:{
        text: 'PIE',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
  }

  // Widget Gauge Graph
  gaugeGraph(){
    let theme = 'theme-light'
    this.gauge  = {
            title: {
            show: true,
            text:'GAUGE',
            top:-4,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
              fontSize: '16',
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
                offsetCenter: [0, '70%']
            },
            data: [{
                value: 90
            }]
          }]
          };
  }

  // Widget Donut Graph
  donutGraph(){
    let theme = 'theme-light'
    this.donut ={
      title:{
        text: 'DONUT',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
  }

  // Widget Funnel Graph 
  funnelGraph(){
    let theme = 'theme-light'
    this.funnel ={
      title:{
        text: 'FUNNEL',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
  }

  // Widget Bar graph
  bargraph(){
    let theme = 'theme-light'
    this.bar =  {
      title:{
        text: 'BAR',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
        }
    ]
    };
  }
  multiplechart(){
    let theme = 'theme-light'
    this.multiple =  {
      title:{
        text: 'MULTIPLE Y AXIS',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
  }
  //CandleStick Graph
  candleStickGraph(){
    let theme = 'theme-light'
    this.candleStick = {
      title:{
        text: 'CANDLE-STICK',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
    };
  }

  //Widgets Line Graph
  lineGraph(){
    let theme = 'theme-light'
    this.line= {
      title:{
        text: 'LINE',
        left:'center',
        textStyle: {
          color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver',
          fontSize: '16',
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
        type: 'line'
      }]
  };
  }

  // Widget Choosing
  widgetChoose(e){
    this.widgetType = e;
  }
}
