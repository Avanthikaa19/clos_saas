import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
// import { SearchScope } from './models/model';
// import { ServiceService } from 'src/app/admin-dashboard/service.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { CustomServiceService } from '../../service/custom-service.service';
import { WidgetsComponent } from '../widgets.component';
import { SearchScope } from '../../models/model';
import * as echarts from 'echarts';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-widgets-screen',
  templateUrl: './widgets-screen.component.html',
  styleUrls: ['./widgets-screen.component.scss']
})
export class WidgetsScreenComponent implements OnInit {
  allWidgets: any;
  option: any[] = [];
  chooser: any;
  loading: boolean;
  keyword : string = '';
  page: number = 0;
  searchscope: SearchScope = new SearchScope(4,'Existing-Widget');
  totalCount:any;
  timer:any = null;
  tableData: any=[];
  tableArray:any = [];
  highcharts = Highcharts;
  currentPage:number=1;
  pageSizeforPagination:any;
  categoryData=[];
  candleStickData=[];
  constructor(
    public dialogRef: MatDialogRef<WidgetsScreenComponent>,
    private url: UrlService,
    public dialog: MatDialog,
    public customService: CustomServiceService,
    // public adminDataService: ServiceService
  ) { }

  public updateUrl(): Promise < any > {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.getAllWidgets();
  }

  // Get All Widgets for Preview
  getAllWidgets(){
    this.loading = true;
    this.customService.getWidgets(this.keyword,this.page +1,this.searchscope.pageSize).subscribe(
      (res:any)=>{
        this.allWidgets = res['data'];
        this.totalCount = res['count'];
        this.loading = false;
        this.pageSizeforPagination=(this.totalCount/this.searchscope.pageSize)
        this.allWidgets.forEach((element:any, index:any )=> this.Options(element,index));
      }
    )
  }
  getPageNumbers(): number[] {
    const totalCount = this.totalCount;
    const pageSize = this.searchscope.pageSize;
 
    const totalPages = Math.ceil(totalCount / pageSize);
    return Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5);
  }
 
  nextPage(): void {
   const totalCount = this.totalCount;
   const pageSize = this.searchscope.pageSize;
    const totalPages = Math.ceil(totalCount / pageSize);
    if (this.page < totalPages) {
      this.page++;
    }
  }
  isLastPage(): boolean {
   const totalCount = this.totalCount;
   const pageSize = this.searchscope.pageSize;
 
    const totalPages = Math.ceil(totalCount / pageSize);
    return this.page+1 === totalPages;
  }


  onKeyup(event:any){
    if (event != null) {
      if (event.length > 0 || event.length == undefined) {
    clearTimeout(this.timer); 
    this.page=0;
    this.timer = setTimeout(() =>{this.getAllWidgets()}, 1000)
      }
    }
  }

  saveNewWidget(index:any){
    this.dialogRef.close({widget: this.allWidgets[index]});
  }

  // Pagination
  onPaginateChange(event:any){
    this.searchscope.pageSize = event.pageSize;
    this.page = event.pageIndex;
    // this.customService.savePageSize(this.searchscope).subscribe();
    this.getAllWidgets();
    }
    tableDataIndex:any=[];
    tableArrayIndex:any=[];

  console(index){
    // console.log(this.allWidgets[index].type)
    // console.log(this.allWidgets[index].graphSettings)
  }
  splitData(rawData) {
    let categoryData = [];
    let values = [];
    let volumes = [];
    for (let i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
      volumes.push([i, rawData[i][3], rawData[i][0] > rawData[i][1] ? 1 : -1]);
    }
    return {
      categoryData: categoryData,
      values: values,
      volumes: volumes
    };
  }

  Options(widget:any, index:any){
    widget.actualData = JSON.parse(widget.data);
    let theme='theme-light';
    switch(this.allWidgets[index].type){
      case "table":
        this.tableArray = [];
        this.tableData = this.allWidgets[index].actualData.data;
        this.tableDataIndex[index]=this.tableData;
        this.tableArrayIndex[index]=this.tableArray;
        Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
        break;
      case "lineChart":
        this.option[index] = {
          title:{
            show: this.allWidgets[index].graphSettings.titleShow,
            text: this.allWidgets[index].graphSettings.titleText,
            left: this.allWidgets[index].graphSettings.titleAlign,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
            }
          },
          tooltip: {
            show: this.allWidgets[index].graphSettings.toolTipShow,
            trigger: this.allWidgets[index].graphSettings.toolTipTrigger,
            formatter: (params:any) => {
              return '<span>' + params.seriesName + '</span><br><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + params.color + '"></span>' + params.name + ' : <b>' + Number(Math.round(parseFloat(params.value) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</b>';
            },
            position: function (point:any, params:any, dom:any, rect:any, size:any) {
              var obj: { top: any, [key: string]: any } = { top: point[1] };
              obj[['right', 'left'][+(point[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
            },
          },
          toolbox: {
            show: this.allWidgets[index].graphSettings.toolboxShow,
            top: '10',
            right:'30',
            feature: {
              dataZoom: {
                show: this.allWidgets[index].graphSettings.toolboxZoom,
                yAxisIndex: 'none'
              },
              dataView: { show: this.allWidgets[index].graphSettings.toolboxData, readOnly: false },
              magicType: { show: this.allWidgets[index].graphSettings.toolboxType, type: ['line', 'bar'] },
              restore: {show: this.allWidgets[index].graphSettings.toolboxType},
              saveAsImage: { show: this.allWidgets[index].graphSettings.toolboxSave}
            }
          },
          legend: {
            show: this.allWidgets[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.allWidgets[index].graphSettings.legendAlign,
            orient: this.allWidgets[index].graphSettings.legendOrient,
            data: [this.allWidgets[index].graphSettings.legendName]
            },
          xAxis: {
              type: this.allWidgets[index].graphSettings.xAxis,
              data: this.allWidgets[index].actualData.headers
          },
          yAxis: {
              type: this.allWidgets[index].graphSettings.yAxis,
              axisLabel: {
                formatter: (value:any) => {
                    if (value >= 1000000000) {
                        value = (value / 1000000000) + 'B';
                    }
                    if (value >= 1000000) {
                        value = (value / 1000000) + 'M';
                    }
                    if (value >= 1000) {
                        value = (value / 1000) + 'K';
                    }
                    if (value >= 100000) {
                        value = (value / 1000000) + 'L';
                    }
                    if (value <= -1000000000) {
                      value = (value / 1000000000) + 'B';
                    }
                    if (value <= -1000000) {
                        value = (value / 1000000) + 'M';
                    }
                    if (value <= -100000) {
                        value = (value / 1000000) + 'L';
                    }
                    if (value <= -1000) {
                        value = (value / 1000) + 'K';
                    }
                    return value;
                },
            },
          },
          label: {
            show: this.allWidgets[index].graphSettings.labelShow,
            position: this.allWidgets[index].graphSettings.labelPosition
          },
          labelLine: {
            show: this.allWidgets[index].graphSettings.labelLineShow
          },
          series: [{
            data: this.allWidgets[index].actualData.data,
            type: 'line',
            name: this.allWidgets[index].graphSettings.legendName,
            showBackground: true,
            itemStyle: {
              // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   { offset: 0, color: '#83bff6' },
              //   { offset: 0.5, color: '#8fd9ce' },
              //   { offset: 1, color: 'rgb(7, 148, 173)' }
              // ])
            },
            emphasis: {
              itemStyle: {
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //   { offset: 0, color: 'rgb(7, 148, 173)' },
                //   { offset: 0.7, color: '#8fd9ce' },
                //   { offset: 1, color: '#83bff6' }
                // ])
              }
            }, 
          }]
        };
        break;
      case "pieChart":
        this.option[index] = {
          title:{
            show: this.allWidgets[index].graphSettings.titleShow,
            text: this.allWidgets[index].graphSettings.titleText,
            left: this.allWidgets[index].graphSettings.titleAlign,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
            }
          },
          tooltip: {
            show: this.allWidgets[index].graphSettings.toolTipShow,
            trigger: this.allWidgets[index].graphSettings.toolTipTrigger
          },
          legend: {
            show: this.allWidgets[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 10,
            left: this.allWidgets[index].graphSettings.legendAlign,
            orient: this.allWidgets[index].graphSettings.legendOrient,
          },
          toolbox: {
            show: this.allWidgets[index].graphSettings.toolboxShow,
            top: '10',
            right:'30',
            feature: {
              dataView: { show:this.allWidgets[index].graphSettings.toolboxData, readOnly: false },
              saveAsImage: {show: this.allWidgets[index].graphSettings.toolboxSave}
            }
          },
          series: [
              {
                  name: 'Pie',
                  type: 'pie',
                  radius: this.allWidgets[index].graphSettings.radius,
                  label: {
                    show: this.allWidgets[index].graphSettings.labelShow,
                    position: this.allWidgets[index].graphSettings.labelPosition
                  },
                  labelLine: {
                    show: this.allWidgets[index].graphSettings.labelLineShow
                  },
                  data: this.allWidgets[index].actualData.data,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  },
              }
          ]
        };
        break;
      case "gaugeChart":
        this.option[index] = {
          title: {
          show: this.allWidgets[index].graphSettings.titleShow,
          text:this.allWidgets[index].graphSettings.titleText,
          top:-4,
          textStyle: {
            color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
          },
          // label: {
          //   fontSize:'10',
          // },
          left:this.allWidgets[index].graphSettings.titleAlign
        },
        series: [{
          top:-10,
          type: 'gauge',
          // color: 'rgb(7, 148, 173)',
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
              fontSize: 20,
              offsetCenter: [0, '100%']
          },
          data: [this.allWidgets[index].actualData]
        }]
        };
        break;
      case "donutChart":
        this.option[index] = {
          title:{
            show: this.allWidgets[index].graphSettings.titleShow,
            text: this.allWidgets[index].graphSettings.titleText,
            left:this.allWidgets[index].graphSettings.titleAlign,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
            }
          },
          tooltip: {
            show: this.allWidgets[index].graphSettings.toolTipShow,
            trigger: this.allWidgets[index].graphSettings.toolTipTrigger
          },
          legend: {
            show: this.allWidgets[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.allWidgets[index].graphSettings.legendAlign,
            orient: this.allWidgets[index].graphSettings.legendOrient,
          },
          toolbox: {
            show: this.allWidgets[index].graphSettings.toolboxShow,
            top: '10',
            right:'30',
            feature: {
              dataView: { show: this.allWidgets[index].graphSettings.toolboxData, readOnly: false },
              saveAsImage: { show: this.allWidgets[index].graphSettings.toolboxSave }
            }
          },
          series: [
              {
                  name: 'Pie',
                  type: 'pie',
                  radius: [this.allWidgets[index].graphSettings.innerRadius, this.allWidgets[index].graphSettings.outerRadius],
                  avoidLabelOverlap: false,
                  label: {
                    show:this.allWidgets[index].graphSettings.labelShow,
                    position: this.allWidgets[index].graphSettings.labelPosition
                  },
                  labelLine: {
                    show: this.allWidgets[index].graphSettings.labelLineShow
                  },
                    data: this.allWidgets[index].actualData.data,
              }
          ]
        };
        break;
      case "funnelChart":
        this.option[index] = {
          title:{
            show: this.allWidgets[index].graphSettings.titleShow,
            text: this.allWidgets[index].graphSettings.titleText,
            left: this.allWidgets[index].graphSettings.titleAlign,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
            }
          },
          tooltip: {
            show: this.allWidgets[index].graphSettings.toolTipShow,
            trigger: this.allWidgets[index].graphSettings.toolTipTrigger
          },
          legend: {
            show: this.allWidgets[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left:this.allWidgets[index].graphSettings.legendAlign,
            orient: this.allWidgets[index].graphSettings.legendOrient,
            },
            toolbox: {
              show: this.allWidgets[index].graphSettings.toolboxShow,
              top: '10',
              right:'30',
              feature: {
                dataView: { show: this.allWidgets[index].graphSettings.toolboxData, readOnly: false },
                saveAsImage: { show: this.allWidgets[index].graphSettings.toolboxSave }
              }
            },
          series: [
            {
              name:'Funnel',
              type:'funnel',
              left: '10%',
              // top: 60,
              // bottom: 60,
              width: '80%',
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 1,
              label: {
                  show: this.allWidgets[index].graphSettings.labelShow,
                  position: this.allWidgets[index].graphSettings.labelPosition
              },
              labelLine: {
                  show: this.allWidgets[index].graphSettings.labelLineShow,
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
              data: this.allWidgets[index].actualData.data
          }
          ]
        };
        break;
      case "barChart":
        this.option[index] = {
          title:{
            show: this.allWidgets[index].graphSettings.titleShow,
            text: this.allWidgets[index].graphSettings.titleText,
            left: this.allWidgets[index].graphSettings.titleAlign,
            textStyle: {
              color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
            }
          },
          tooltip: {
            show: this.allWidgets[index].graphSettings.toolTipShow,
            trigger: this.allWidgets[index].graphSettings.toolTipTrigger,
            formatter: (params:any) => {
              return '<span>' + params.seriesName + '</span><br><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + params.color + '"></span>' + params.name + ' : <b>' + Number(Math.round(parseFloat(params.value) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</b>';
            },
            position: function (point:any, params:any, dom:any, rect:any, size:any) {
              var obj: { top: any, [key: string]: any } = { top: point[1] };
              obj[['right', 'left'][+(point[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
            },
          },
          toolbox: {
            show: this.allWidgets[index].graphSettings.toolboxShow,
            top: '10',
            right:'30',
            feature: {
              dataZoom: {
                show: this.allWidgets[index].graphSettings.toolboxZoom,
                yAxisIndex: 'none'
              },
              dataView: { show: this.allWidgets[index].graphSettings.toolboxData,readOnly: false },
              magicType: { show: this.allWidgets[index].graphSettings.toolboxType, type: ['line', 'bar'] },
              restore: {show: this.allWidgets[index].graphSettings.toolboxType,},
              saveAsImage: {show: this.allWidgets[index].graphSettings.toolboxSave,}
            }
          },
          legend: {
            show: this.allWidgets[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.allWidgets[index].graphSettings.legendAlign,
            orient: this.allWidgets[index].graphSettings.legendOrient,
            data: [this.allWidgets[index].graphSettings.legendName]
            },
          xAxis: {
              type: this.allWidgets[index].graphSettings.xAxis,
              data: this.allWidgets[index].actualData.headers
          },
          yAxis: {
              type: this.allWidgets[index].graphSettings.yAxis,
              axisLabel: {
                formatter: (value:any) => {
                    if (value >= 1000000000) {
                        value = (value / 1000000000) + 'B';
                    }
                    if (value >= 1000000) {
                        value = (value / 1000000) + 'M';
                    }
                    if (value >= 1000) {
                        value = (value / 1000) + 'K';
                    }
                    if (value >= 100000) {
                        value = (value / 1000000) + 'L';
                    }
                    if (value <= -1000000000) {
                      value = (value / 1000000000) + 'B';
                    }
                    if (value <= -1000000) {
                        value = (value / 1000000) + 'M';
                    }
                    if (value <= -100000) {
                        value = (value / 1000000) + 'L';
                    }
                    if (value <= -1000) {
                        value = (value / 1000) + 'K';
                    }
                    return value;
                },
            },
          },
          label: {
            show: this.allWidgets[index].graphSettings.labelShow,
            position: this.allWidgets[index].graphSettings.labelPosition
          },
          labelLine: {
            show: this.allWidgets[index].graphSettings.labelLineShow
          },
          series: [{
              data: this.allWidgets[index].actualData.data,
              type: 'bar',
              name : this.allWidgets[index].graphSettings.legendName,
              showBackground: true,
            itemStyle: {
              // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   { offset: 0, color: '#83bff6' },
              //   { offset: 0.5, color: '#8fd9ce' },
              //   { offset: 1, color: 'rgb(7, 148, 173)' }
              // ])
            },
            emphasis: {
              itemStyle: {
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //   { offset: 0, color: 'rgb(7, 148, 173)' },
                //   { offset: 0.7, color: '#8fd9ce' },
                //   { offset: 1, color: '#83bff6' }
                // ])
              }
            }, 
          }]
        };
        break; 
        case "multipleChart":
          const actualData = this.allWidgets[index]?.actualData?.data;
          const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'];
          const labels = actualData.map(item => item.label);
          const values = actualData.map(item => item.value);
          const names = actualData.map(item => item.name);
          this.option[index] = {
            color: colors,
          
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              right: '20%'
            },
            toolbox: {
              top: '10',
              right:'30',
              feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            title: {
              text: this.allWidgets[index]?.graphSettings.titleText
            },
            legend: {
                show: this.allWidgets[index]?.graphSettings.legendShow,
                type: 'scroll',
                bottom: 1,
                left: this.allWidgets[index]?.graphSettings.legendAlign,
                orient: this.allWidgets[index]?.graphSettings.legendOrient,
                data: [this.allWidgets[index]?.graphSettings.legendName,this.allWidgets[index]?.graphSettings.legendName2,this.allWidgets[index]?.graphSettings.legendName3],
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              },            
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                // prettier-ignore
                data:names,
              }
            ],
            yAxis: [
              {
                type: 'value',
                position: 'right',
                alignTicks: true,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: colors[0]
                  }
                },
                axisLabel: {
                  formatter: '{value}'
                }
              },
              {
                type: 'value',
                position: 'right',
                alignTicks: true,
                offset: 80,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: colors[1]
                  }
                },
                axisLabel: {
                  formatter: '{value}'
                }
              },
              {
                type: 'value',
                position: 'left',
                alignTicks: true,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: colors[2]
                  }
                },
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name:this.allWidgets[index]?.graphSettings.legendName,
                type: 'bar',
                data: values,
                itemStyle: {
                  color: colors[0]
                }
              },
              {
                name:this.allWidgets[index]?.graphSettings.legendName2,
                type: 'bar',
                yAxisIndex: 1,
                data: values,
                itemStyle: {
                  color: colors[1]
                }
              },
              {
                name:this.allWidgets[index]?.graphSettings.legendName3,
                type: 'line',
                yAxisIndex: 1,
                data: values,
                itemStyle: {
                  color: colors[2]
                }
              },
            ]
          };
          break; 
          case "candleStick": {
            let upColor = '#00da3c';
            let downColor = '#ec0000';
            let col;
            const actualData = this.allWidgets[index]?.actualData;
            const Date = actualData.map(item => item.Date);
            const Amount = actualData.map(item => item.Amount);
            const High = actualData.map(item => item.High);
            const Close = actualData.map(item => item.Close);
            const Low = actualData.map(item => item.Low);
            const pfl = actualData.map(item => item.ProfitLoss)
            this.categoryData = Date;
            const Open = actualData.map(item => item.Open);
            const ProfitLoss = actualData.map(item => item.ProfitLoss);
            for(let i=0;ProfitLoss.length>i;i++){
            if(ProfitLoss[i] == "Loss"){
              downColor = "#ec0000";
              col = downColor;
            }
            else if(ProfitLoss[i] == "Profit"){
              upColor = "#00da3c";
              col = upColor;
            }
          }
          let widget=actualData.map(item=>[item.Open,item.Close,item.Low,item.High])
          this.candleStickData=widget;
            // Create an array of OHLC data
            this.option[index] = {
              animation: false,
              legend: {
                bottom: 10,
                left: 'center',
                data: [this.allWidgets[index].graphSettings.legendName],
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              },
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross'
                },
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                  color: '#000'
                },
                position: function (pos, params, el, elRect, size) {
                  const obj = {
                    top: 10
                  };
                  obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                  return obj;
                }
              },
              axisPointer: {
                link: [
                  {
                    xAxisIndex: 'all'
                  }
                ],
                label: {
                  backgroundColor: '#777'
                }
              },
              toolbox: {
                right:'35px',
                feature: {
                  dataZoom: {
                    yAxisIndex: false
                  },
                  brush: {
                    type: ['lineX', 'clear']
                  }
                }
              },
              brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                  colorAlpha: 0.1
                }
              },
              visualMap: {
                show: false,
                seriesIndex: 5,
                dimension: 2,
                pieces: [
                  {
                    value: 1,
                    color: downColor
                  },
                  {
                    value: -1,
                    color: upColor
                  }
                ]
              },
              grid: [
                {
                  left: '10%',
                  right: '8%',
                  height: '50%'
                },
                {
                  left: '10%',
                  right: '8%',
                  top: '63%',
                  height: '16%'
                }
              ],
              xAxis: [
                {
                  type: 'category',
                  data: this.categoryData,
                  boundaryGap: false,
                  axisLine: { onZero: false },
                  splitLine: { show: false },
                  min: 'dataMin',
                  max: 'dataMax',
                  axisPointer: {
                    z: 100
                  }
                },
                {
                  type: 'category',
                  gridIndex: 1,
                  data: this.categoryData,
                  boundaryGap: false,
                  axisLine: { onZero: false },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  min: 'dataMin',
                  max: 'dataMax'
                }
              ],
              yAxis: [
                {
                  scale: true,
                  splitArea: {
                    show: true
                  },
                  min: 1000,
                  max: 100000000,
                },
                {
                  scale: true,
                  gridIndex: 1,
                  splitNumber: 2,
                  axisLabel: { show: false },
                  axisLine: { show: false },
                  axisTick: { show: false },
                  splitLine: { show: false }
                }
              ],
              dataZoom: [
                {
                  type: 'inside',
                  xAxisIndex: [0, 1],
                  start: 0,
                  end: 100
                },
                {
                  show: true,
                  xAxisIndex: [0, 1],
                  type: 'slider',
                  top: '85%',
                  start: 0,
                  end: 100
                }
              ],
              series: [
                {
                type: 'candlestick',
                data: this.candleStickData,
                itemStyle: {
                  color0: downColor,
                  color: upColor,
                  borderColor: undefined,
                  borderColor0: undefined
                },
              },
                {
                  type: 'bar',
                  data: Amount,
                  name: this.allWidgets[index].graphSettings.legendName,
                  xAxisIndex: 1,
                  yAxisIndex: 1,
                  color: col
                },
              ]
            }
          }
          break;
    }
        }
  }


