import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { GridStackElement, SearchScope, Widgets } from '../../models/model';
import { CustomServiceService } from '../../service/custom-service.service';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { DatePipe } from '@angular/common';
import { TableQueryFilterComponent } from '../table-query-filter/table-query-filter.component';
import { MatPaginator } from '@angular/material/paginator';
import * as echarts from 'echarts';
import Highcharts3D from 'highcharts/highcharts-3d'; // Import the 3D module
import * as Highcharts from 'highcharts';
import funnel from 'highcharts/modules/funnel';
import funnel3d from 'highcharts/modules/funnel3d';
import funnelchart from 'highcharts/modules/cylinder';
import timeline from 'highcharts/modules/timeline';
import { ColorService } from '../../color-service';
import { ThemeService } from 'src/app/dynamic-dashboard/theme-service';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
timeline(Highcharts)
Highcharts3D(Highcharts)
funnel3d(Highcharts);
funnelchart(Highcharts)
funnel(Highcharts)
timeline(Highcharts)


@Component({
  selector: 'app-existing-widget',
  templateUrl: './existing-widget.component.html',
  styleUrls: ['./existing-widget.component.scss']
})
export class ExistingWidgetComponent implements OnInit {
  widget: Widgets = new Widgets();
  previewOption:any;
  graphHeader: string[] = [];
  graphData1: number[] = [];
  graphData2 : any[]= []
  graphDataGauge: any = {
    value: 90
  };
  tableData: any=[];
  tableArray:any = [];
  totalCount!: number;
  queryText: any;
  dateTime:any;
  date = new Date();
  savingByAccount: boolean = false;
  downloadStatusSubscription!: Subscription;
  currentDownloadJob!: DownloadJob;
  currentJob: any;
  popup: boolean = false;
  tabLoading: boolean = false;
  ability:any;
  accessMsg:any;
  editAbility:any;
  downloadAbility:boolean=false;
  editing:boolean=false;
  deleting:boolean=false;
  deleteAbility:any;
  filterapply:boolean=false;
  filterVal:any=[];
  filterVal2:any=[];
  component_height:any;
  isLoading:boolean=false;
  highcharts = Highcharts;
  threeDim: boolean = false;
  layoutid:string;
  darkBkcolor:string;
  lightBkcolor:string;
  cardleft:string='';
  cardright:string='';
  cardtop:string='';
  cardbottom:string='';
  cardcolor:string='';
  cardtxt:string='';
  graphDataMultiple: any = [50, 20, 100];
  userColor: string;
  themeData: any = [];
  chartType:string='';
  @HostListener('window:resize', ['$event'])
  updateComponentSize() {
    this.component_height = window.innerHeight;
  }
  constructor(
    public dialogRef: MatDialogRef<ExistingWidgetComponent>,
    private url: UrlService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public customService: CustomServiceService,
    public snackBar: MatSnackBar,
    public datepipe: DatePipe,
    private colorService: ColorService,
    private themeService: ThemeService,
  ) {
    this.updateComponentSize();
    this.widget = data.widget;
    this.widget.actualData = JSON.parse(data.widget.data);
    if (this.themeData !== undefined && this.widget?.id !== undefined) {
      this.themeData = this.themeService.getThemeData();
    }
    this.threeDim = data.threeDim;
    this.layoutid = data.layoutID;
    this.chartType=this.widget.type;
     if (this.widget.type !== 'table' && this.widget.type !== 'cardChart' && this.widget.type !== 'gaugeChart' && this.threeDim == true) {
      this.widget.type=localStorage.getItem('typeOfChart')
      this.preview3dOptions(this.widget.type)
     }
  }
  async ngOnInit() {
    if(this.layoutid != null && this.layoutid !== undefined){
      this.darkBkcolor=this.colorService.getthColor(this.layoutid.toString());
      this.lightBkcolor=this.colorService.gettbColor(this.layoutid.toString());
      this.cardleft=this.colorService.getcardlColor(this.layoutid.toString());
      this.cardright=this.colorService.getcardlColor(this.layoutid.toString());
      this.cardtop=this.colorService.getcardlColor(this.layoutid.toString());
      this.cardbottom=this.colorService.getcardlColor(this.layoutid.toString());
      this.cardcolor=this.colorService.getcardColor(this.layoutid.toString());
      this.cardtxt=this.colorService.getcardTxt(this.layoutid.toString());
      }
    // console.log(this.layoutid)
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.chooseType();
    this.showQueryData(this.widget.queryText)
    if(this.widget.type=='gaugeChart' && typeof(this.graphDataGauge.value)==='string'){
      this.widget.query.columnName1=[]
    }
    // this.previewOptions();
  }
  currentPage:number=1;
  getPageNumbers(): number[] {
   const totalCount = this.totalCount;
   const pageSize = this.searchScope.pageSize;

   const totalPages = Math.ceil(totalCount / pageSize);
   return Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5);
 }

 nextPage(): void {
  const totalCount = this.totalCount;
  const pageSize = this.searchScope.pageSize;
   const totalPages = Math.ceil(totalCount / pageSize);
   if (this.loadMoreGraphs < totalPages) {
     this.loadMoreGraphs++;
   }
 }
 isLastPage(): boolean {
  const totalCount = this.totalCount;
  const pageSize = this.searchScope.pageSize;

   const totalPages = Math.ceil(totalCount / pageSize);
   return this.loadMoreGraphs+1 === totalPages;
 }

  public updateUrl(): Promise<any> {
    return this.url.getUrl().toPromise();
  }
  //Close the dialog
  onClose(): void {
    this.dialogRef.close();
  }

  //Open apply filter
  applyFilter(layout?: GridStackElement) {
    const dialogRef = this.dialog.open(TableQueryFilterComponent, {
      width: '1800px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: { panelName: layout?.panelName, widget: this.widget }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result != null) {
          this.filterapply = true;
          this.filterVal = result[2].where;
          this.filterVal2 = result[2].where2;
          this.queryText = result[1];
          for (let i = 0; i < this.filterVal?.length; i++) {
            if (this.filterVal[i]?.operandField === '') {
              this.filterapply = false;
            }
          }
          if (this.widget.type == 'table') {
            this.widget.actualData = result[0];
            this.tableArray = [];
            this.tableData = this.widget?.actualData.data;
            this.totalCount = this.widget?.actualData.count;
            Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
            // this.paginator.pageIndex=0;
            this.showQueryData(this.queryText);
          }
          if (this.widget.type == 'cardChart' || this.widget.type == 'card' || this.widget.type == 'gaugeChart') {
            this.graphDataGauge.value = result[0]['value'];
            this.previewOptions()
          }
          if (this.widget.type == 'barChart' || this.widget.type == 'lineChart') {
            this.graphData1 = result[0]['data'];
            this.graphHeader = result[0]['headers'];
            this.previewOptions()
          }
          if (this.widget.type == 'pieChart' || this.widget.type == 'funnelChart' || this.widget.type == 'donutChart') {
            this.graphData2 = result[0]['data'];
            this.previewOptions()
          }
          if(this.widget.type=='candleStick'){
            // console.log(result)
            this.widget.actualData=result[0]['data'];
            this.previewOptions();
          }
        }
        else {
          this.filterapply = true
          this.previewOptions();
        }
      }
    )
  }
  chooseType() {
    switch (this.widget.type) {
      case "lineChart":
        this.graphData1 = this.widget.actualData.data;
        this.graphHeader = this.widget.actualData.headers;
        break;
      case "pieChart":
        this.graphData2 = this.widget.actualData.data;
        break;
      case "gaugeChart":
        this.graphDataGauge = this.widget.actualData;
        break;
      case "donutChart":
        this.graphData2 = this.widget.actualData.data;
        break;
      case "funnelChart":
        this.graphData2 = this.widget.actualData.data;
        break;
      case "barChart":
        this.graphData1 = this.widget.actualData.data;
        this.graphHeader = this.widget.actualData.headers;
        break;
      case "cardChart":
        this.graphDataGauge = this.widget.actualData;
        break;
      case "table":
        this.tableData = this.widget.actualData.data;
        this.tableArray = [];
        this.totalCount = this.widget.actualData.count;
        this.queryText=this.widget.queryText
        Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
        break;
      case "multipleChart":
        this.graphData1 = this.widget?.actualData?.data;
        this.graphHeader = this.widget?.actualData?.headers;
        this.graphDataMultiple=this.widget?.actualData?.data;
        break;
      case "candleStick":
        const actualData=this.widget.actualData?.data;
        if(actualData!==undefined||actualData?.length!==0){
          this.candleStickData=actualData?.data
        }
        else{
          this.candleStickData=[[20000, 34000, 10000, 30008],
          [40000, 350000, 300000, 50000],
          [310000, 380000, 330000, 440000],
          [38000, 150000, 5000, 4002]
        ]
        }
        break;
    }
    this.showQueryData(this.widget.queryText)
  }
  hexToRGBA(hex, alpha) {
    // Remove the hash if it exists
    hex = hex.replace("#", "");

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA value
    return `rgba(${r},${g},${b},${alpha})`;
  }
  previewOptions() {
    let theme = 'theme-light';
    let bg = 'theme-light';
    this.darkBkcolor=this.colorService.getthColor(this.layoutid);
    this.lightBkcolor = this.colorService.gettbColor(this.layoutid); 
    this.cardleft= this.colorService.getcardlColor(this.layoutid);
    this.cardright= this.colorService.getcardrColor(this.layoutid);
    this.cardtop= this.colorService.getcardtColor(this.layoutid);
    this.cardbottom= this.colorService.getcardbColor(this.layoutid);
    this.cardcolor= this.colorService.getcardColor(this.layoutid);
    this.cardtxt=this.colorService.getcardTxt(this.layoutid);
    switch (this.widget.type) {
      case "table":
        this.tableArray = [];
        this.tableData = this.widget.actualData.data;
        this.queryText = this.widget?.queryText;
        this.totalCount = this.widget?.actualData.count;
        Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
        break;
        case "lineChart":
          this.previewOption = {
            title:{
              show: this.widget.graphSettings.titleShow,
              text: this.widget.graphSettings.titleText,
              left: this.widget.graphSettings.titleAlign,
              textStyle: {
                color: this.gettextColor(this.layoutid)
              }
            },
            color:this.gettheme(this.layoutid),
            tooltip: {
              show: this.widget.graphSettings.toolTipShow,
              backgroundColor: bg == 'theme-light'?'white':'black',
              trigger: this.widget.graphSettings.toolTipTrigger,
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
              show: this.widget.graphSettings.toolboxShow,
              top: '10',
              right:'30',
              feature: {
                dataZoom: {
                  show: this.widget.graphSettings.toolboxZoom,
                  yAxisIndex: 'none'
                },
                dataView: { show: this.widget.graphSettings.toolboxData, readOnly: false },
                magicType: { show: this.widget.graphSettings.toolboxType, type: ['line', 'bar'] },
                restore: {show: this.widget.graphSettings.toolboxType},
                saveAsImage: { show: this.widget.graphSettings.toolboxSave}
              }
            },
            legend: {
              show: this.widget.graphSettings.legendShow,
              type: 'scroll',
              bottom: 1,
              left: this.widget.graphSettings.legendAlign,
              orient: this.widget.graphSettings.legendOrient,
              textStyle: {
                color: '#777',
                textShadowColor: '#777',
                textShadowOffsetX: 1,
            },
              data: [this.widget.graphSettings.legendName]
              },
            xAxis: {
                type: this.widget.graphSettings.xaxis,
                data: this.graphHeader
            },
            yAxis: {
                type: this.widget.graphSettings.yaxis,
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
              show: this.widget.graphSettings.labelShow,
              position: this.widget.graphSettings.labelPosition
            },
            labelLine: {
              show: this.widget.graphSettings.labelLineShow
            },
            series: [{
              data: this.graphData1,
              type: 'line',
              name: this.widget.graphSettings.legendName,
              showBackground: true,
              label:{
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              }},
            }]
          };
          break;
          case "pieChart":
            this.previewOption = {
              title:{
                show: this.widget.graphSettings.titleShow,
                text: this.widget.graphSettings.titleText,
                left: this.widget.graphSettings.titleAlign,
                textStyle: {
                  color: this.gettextColor(this.layoutid)
                }
              },
              color:this.gettheme(this.layoutid),
              // color:this.themeData===undefined?'rgba(0, 0, 0, 0.5)':this.themeData.color,
              tooltip: {
                show: this.widget.graphSettings.toolTipShow,
                backgroundColor: bg == 'theme-light'?'white':'black',
                trigger: this.widget.graphSettings.toolTipTrigger
              },
              legend: {
                show: this.widget.graphSettings.legendShow,
                type: 'scroll',
                bottom: 10,
                left: this.widget.graphSettings.legendAlign,
                orient: this.widget.graphSettings.legendOrient,
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              }
              },
              toolbox: {
                show: this.widget.graphSettings.toolboxShow,
                top: '10',
                right:'30',
                feature: {
                  dataView: { show:this.widget.graphSettings.toolboxData, readOnly: false },
                  saveAsImage: {show: this.widget.graphSettings.toolboxSave}
                }
              },
              series: [
                  {
                      name: 'Pie',
                      type: 'pie',
                      radius: this.widget.graphSettings.radius,
                      label: {
                        show: this.widget.graphSettings.labelShow,
                        position: this.widget.graphSettings.labelPosition,
                          textStyle: {
                            color: '#777',
                            textShadowColor: '#777',
                            textShadowOffsetX: 1,
                        },
                      },
                      labelLine: {
                        show: this.widget.graphSettings.labelLineShow
                      },
                      data: this.graphData2,
                      emphasis: {
                          itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              // shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                      },
                  }
              ]
            };
            break;
            case "gaugeChart":
              this.previewOption = {
                title: {
                show: this.widget.graphSettings.titleShow,
                text:this.widget.graphSettings.titleText,
                top:-4,
                textStyle: {
                  color: this.gettextColor(this.layoutid)
                },
                // label: {
                //   fontSize:'10',
                // },
                left:this.widget.graphSettings.titleAlign
              },
              color:this.gettheme(this.layoutid),
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
                        borderWidth: 4,
                        borderColor:this.gettheme(this.layoutid)[0],
                    }
                },
                 itemStyle:{
                          color:this.gettheme(this.layoutid)[0],
                        },
                detail: {
                    valueAnimation: true,
                    fontSize: 20,
                    offsetCenter: [0, '100%']
                },
                data: [this.graphDataGauge]
              }]
              };
              break;
              case "donutChart":
                this.previewOption = {
                  title:{
                    show: this.widget.graphSettings.titleShow,
                    text: this.widget.graphSettings.titleText,
                    left:this.widget.graphSettings.titleAlign,
                    textStyle: {
                      color: this.gettextColor(this.layoutid)
                    }
                  },
                  color: this.gettheme(this.layoutid),
                  tooltip: {
                    show: this.widget.graphSettings.toolTipShow,
                    backgroundColor: bg == 'theme-light'?'white':'black',
                    trigger: this.widget.graphSettings.toolTipTrigger
                  },
                  legend: {
                    show: this.widget.graphSettings.legendShow,
                    type: 'scroll',
                    bottom: 1,
                    left: this.widget.graphSettings.legendAlign,
                    orient: this.widget.graphSettings.legendOrient,
                    textStyle: {
                      color: '#777',
                      textShadowColor: '#777',
                      textShadowOffsetX: 1,
                  }
                  },
                  toolbox: {
                    show: this.widget.graphSettings.toolboxShow,
                    top: '10',
                    right:'30',
                    feature: {
                      dataView: { show: this.widget.graphSettings.toolboxData, readOnly: false },
                      saveAsImage: { show: this.widget.graphSettings.toolboxSave }
                    }
                  },
                  series: [
                      {
                          name: 'Pie',
                          type: 'pie',
                          radius: [this.widget.graphSettings.innerRadius, this.widget.graphSettings.outerRadius],
                          avoidLabelOverlap: false,
                          label: {
                            show: this.widget.graphSettings.labelShow,
                            position: this.widget.graphSettings.labelPosition,
                              textStyle: {
                                color: '#777',
                                textShadowColor: '#777',
                                textShadowOffsetX: 1,
                            },
                          },
                          labelLine: {
                            show: this.widget.graphSettings.labelLineShow
                          },
                            data: this.graphData2,
                      }
                  ]
                };
                break;
                case "funnelChart":
                  this.previewOption = {
                    title:{
                      show: this.widget.graphSettings.titleShow,
                      text: this.widget.graphSettings.titleText,
                      left: this.widget.graphSettings.titleAlign,
                      textStyle: {
                        color: this.gettextColor(this.layoutid)
                      }
                    },
                    color: this.gettheme(this.layoutid),
                    tooltip: {
                      show: this.widget.graphSettings.toolTipShow,
                      backgroundColor: bg == 'theme-light'?'white':'black',
                      trigger: this.widget.graphSettings.toolTipTrigger
                    },
                    legend: {
                      show: this.widget.graphSettings.legendShow,
                      type: 'scroll',
                      bottom: 1,
                      left: this.widget.graphSettings.legendAlign,
                      orient: this.widget.graphSettings.legendOrient,
                      textStyle: {
                        color: '#777',
                        textShadowColor: '#777',
                        textShadowOffsetX: 1,
                    }
                      },
                      toolbox: {
                        show: this.widget.graphSettings.toolboxShow,
                        top: '10',
                        right:'30',
                        feature: {
                          dataView: { show: this.widget.graphSettings.toolboxData, readOnly: false },
                          saveAsImage: { show: this.widget.graphSettings.toolboxSave }
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
                            show: this.widget.graphSettings.labelShow,
                            position: this.widget.graphSettings.labelPosition,
                              textStyle: {
                                color: '#777',
                                textShadowColor: '#777',
                                textShadowOffsetX: 1,
                            },
                        },
                        labelLine: {
                            show: this.widget.graphSettings.labelLineShow,
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
                        data: this.graphData2
                    }
                    ]
                  };
                  break;
                  case "barChart":
                    this.previewOption = {
                      title:{
                        show: this.widget.graphSettings.titleShow,
                        text: this.widget.graphSettings.titleText,
                        left: this.widget.graphSettings.titleAlign,
                        textStyle: {
                          color: this.gettextColor(this.layoutid)
                        }
                      },
                      color: this.gettheme(this.layoutid),
                      tooltip: {
                        show: this.widget.graphSettings.toolTipShow,
                        trigger: this.widget.graphSettings.toolTipTrigger,
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
                        show: this.widget.graphSettings.toolboxShow,
                        top: '10',
                        right:'30',
                        feature: {
                          dataZoom: {
                            show: this.widget.graphSettings.toolboxZoom,
                            yAxisIndex: 'none'
                          },
                          dataView: { show: this.widget.graphSettings.toolboxData,readOnly: false },
                          magicType: { show: this.widget.graphSettings.toolboxType, type: ['line', 'bar'] },
                          restore: {show: this.widget.graphSettings.toolboxType,},
                          saveAsImage: {show: this.widget.graphSettings.toolboxSave,}
                        }
                      },
                      legend: {
                        show: this.widget.graphSettings.legendShow,
                        type: 'scroll',
                        bottom: 1,
                        left: this.widget.graphSettings.legendAlign,
                        orient: this.widget.graphSettings.legendOrient,
                        data: [this.widget.graphSettings.legendName],
                        textStyle: {
                          color: '#777',
                          textShadowColor: '#777',
                          textShadowOffsetX: 1,
                      }
                        },
                      xAxis: {
                        // name:this.widget.query.columnName1,
                        nameLocation:'middle',
                        nameTextStyle:{
                          lineHeight:40,
                          fontWeight:'600'
                        },
                          type: this.widget.graphSettings.xaxis,
                          data: this.graphHeader
                      },
                      yAxis: {
                        // name:this.widget.query.columnName2,
                        nameLocation:'middle',
                        nameTextStyle:{
                          lineHeight:70,
                          fontWeight:'600'
                        },
                          type: this.widget.graphSettings.yaxis,
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
                        show: this.widget.graphSettings.labelShow,
                        position: this.widget.graphSettings.labelPosition
                      },
                      labelLine: {
                        show: this.widget.graphSettings.labelLineShow
                      },
                      series: [{
                          data: this.graphData1,
                          type: 'bar',
                          name : this.widget.graphSettings.legendName,
                          label:{
                            textStyle: {
                              color: '#777',
                              textShadowColor: '#777',
                              textShadowOffsetX: 1,
                          }},
                          showBackground: true,
                        // itemStyle: {
                        //   color:this.gettheme(this.layoutid)[0]?this.gettheme(this.layoutid)[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        //     { offset: 0, color: '#83bff6' },
                        //     { offset: 0.5, color: '#8fd9ce' },
                        //     { offset: 1, color: 'rgb(7, 148, 173)' }
                        //   ])
                        // },
                        // emphasis: {
                        //   itemStyle: {
                        //     color: this.colorArray?this.colorArray[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        //       { offset: 0, color: 'rgb(7, 148, 173)' },
                        //       { offset: 0.7, color: '#8fd9ce' },
                        //       { offset: 1, color: '#83bff6' }
                        //     ])
                        //   }
                        // }, 
                      }]
                    };
                    break;
      case "multipleChart": {
        const actualData1 = this.widget?.actualData?.data;
        let xaxis,bar1,bar2,line;
         xaxis = actualData1.map(item => item.name);
         bar1 = actualData1.map(item => item.label);
         bar2 = actualData1.map(item => item.value2);
         line = actualData1.map(item => item.value);
        const colors = ['#5470C6', '#91CC75', '#EE6666'];  
        this.previewOption = {
          title: {
            text: this.widget.graphSettings.titleText,
            show: this.widget.graphSettings.titleShow,
            left: this.widget.graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.layoutid)
            }
          },
          color: this.gettheme(this.layoutid),
          tooltip: {
            show: this.widget.graphSettings.toolTipShow,
            trigger: this.widget.graphSettings.toolTipTrigger,
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            right: '20%'
          },
          toolbox: {
            show: this.widget.graphSettings.toolboxShow,
            top: '10',
            right:'30',
            feature: {
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            show: this.widget.graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.widget.graphSettings.legendAlign,
            orient: this.widget.graphSettings.legendOrient,
            data: [this.widget.graphSettings.legendName,this.widget.graphSettings.legendName2,this.widget.graphSettings.legendName3],  
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
            }         
          },
          label: {
            show: this.widget.graphSettings.labelShow,
            position: this.widget.graphSettings.labelPosition
          },
          labelLine: {
            show: this.widget.graphSettings.labelLineShow
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 0, // Adjust the start value as needed
              end: 100 // Adjust the end value as needed
            }],
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              // prettier-ignore
              data:xaxis,
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
                  color: this.gettheme(this.layoutid)?this.gettheme(this.layoutid)[0]:colors[0]
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
                  color: this.gettheme(this.layoutid)?this.gettheme(this.layoutid)[1]:colors[1]
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
                  color: this.gettheme(this.layoutid)?this.gettheme(this.layoutid)[2]:colors[2]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: this.widget.graphSettings.legendName,
              type: 'bar',
              data: bar1,
              label:{
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              }},
              color: this.gettheme(this.layoutid)?this.gettheme(this.layoutid)[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#8fd9ce' },
                { offset: 1, color: 'rgb(7, 148, 173)' }
              ])
            },
            {
              name: this.widget.graphSettings.legendName2,
              type: 'bar',
              yAxisIndex: 1,
              data: bar2,
              label:{
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              }},
              color: this.gettheme(this.layoutid)?this.gettheme(this.layoutid)[1]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#8fd9ce' },
                { offset: 1, color: 'rgb(7, 148, 173)' }
              ])
            },
            {
              name: this.widget.graphSettings.legendName3,
              type: 'line',
              yAxisIndex: 1,
              data: line,
              label:{
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              }},
              color: this.gettheme(this.layoutid)?this.gettheme(this.layoutid)[2]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#8fd9ce' },
                { offset: 1, color: 'rgb(7, 148, 173)' }
              ])
            },
          ]
        };
      }
        break;
        case "candleStick": {
          let upColor = '#00da3c';
          let downColor = '#ec0000';
          let col;
          let actualData
          actualData = this.widget?.actualData?.data;
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
        let volumes = [];
        let widget=actualData.map(item=>[item.Open,item.Close,item.Low,item.High,item.Amount])
        this.candleStickData=widget;    
        for (let i = 0; i <  this.candleStickData.length; i++) {
         volumes.push([i, this.candleStickData[i][4], this.candleStickData[i][0] > this.candleStickData[i][1] ? 1 : -1]);
       }
        function calculateMA(dayCount: number, data: any[]) {
          const result = [];
          for (let i = 0, len = data.length; i < len; i++) {
            if (i < dayCount) {
              result.push('-');
              continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
              sum += data[i - j][1]; // Assuming the data structure is [Open, Close, Low, High]
            }
            result.push(+(sum / dayCount).toFixed(3));
          }
          return result;
        } 
          // Create an array of OHLC data
          this.previewOption = {
            title: {
              text: this.widget.graphSettings.titleText,
              show: this.widget.graphSettings.titleShow,
              left: this.widget.graphSettings.titleAlign,
              textStyle: {
                color: this.gettextColor(this.layoutid)
              }
            },
            animation: false,
            legend: {
              show: this.widget.graphSettings.legendShow,
              type: 'scroll',
              bottom: 10,
              left: this.widget.graphSettings.legendAlign,
              orient: this.widget.graphSettings.legendOrient,
              data: [this.widget.graphSettings.legendName],
              textStyle: {
                color: '#777',
                textShadowColor: '#777',
                textShadowOffsetX: 1,
            },  
            },
            tooltip: {
              show: this.widget.graphSettings.toolTipShow,
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
              show: this.widget.graphSettings.toolboxShow,
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
              seriesIndex: 1,
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
              }
            ],
            yAxis: [
              {
                scale: true,
                splitArea: {
                  show: true
                },
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
              name: this.widget.graphSettings.legendName,
              type: 'candlestick',
              data: this.candleStickData,
              itemStyle: {
                color0: downColor,
                color: upColor,
                borderColor: undefined,
                borderColor0: undefined
              },
            },
            // {
            //   name: 'MA1', // Adjust the name as needed
            //   type: 'line',
            //   data: calculateMA(1, this.candleStickData),
            //   smooth: true,
            //   lineStyle: {
            //     opacity: 0.5,
            //   },
            // },
            // {
            //   name: 'MA3', // Adjust the name as needed
            //   type: 'line',
            //   data: calculateMA(3, this.candleStickData),
            //   smooth: true,
            //   lineStyle: {
            //     opacity: 0.5,
            //   },
            // },
            //  {
            //   name: 'MA5', // Adjust the name as needed
            //   type: 'line',
            //   data: calculateMA(5, this.candleStickData),
            //   smooth: true,
            //   lineStyle: {
            //     opacity: 0.5,
            //   },
            // },
              {
                type: 'bar',
                data: volumes,
                xAxisIndex: 1,
                yAxisIndex: 1,
              //   itemStyle: {
              //     color: (params: any) => {
              //       const dataIndex = params.dataIndex;
              //       if (dataIndex === 0) {
              //           const firstOpen = this.candleStickData[dataIndex][0];
              //           const firstClose = this.candleStickData[dataIndex][1];
            
              //           // If firstOpen is equal to firstClose, compare next close with firstClose
              //           if (firstOpen === firstClose) {
              //               const nextClose = this.candleStickData[dataIndex + 1][1];
              //               return nextClose > firstClose ? upColor : downColor;
              //           } else {
              //               // Determine the color for the first bar based on firstClose and firstOpen
              //               return firstClose > firstOpen ? upColor : downColor;
              //           }
              //       } else if (dataIndex > 0) {
              //           const currentOpen = this.candleStickData[dataIndex][0];
              //           const currentClose = this.candleStickData[dataIndex][1];
              //           const previousClose = this.candleStickData[dataIndex - 1][1];
            
              //           // Check if open and close are equal
              //           if (currentOpen === currentClose) {
              //               // Compare the current close with the previous close
              //               return currentClose > previousClose ? upColor : downColor;
              //           } else {
              //               // Compare the current close with the current open
              //               return currentClose > currentOpen ? upColor : downColor;
              //           }
              //       } else {
              //           // For any other case, you can choose a default color or handle it differently
              //           return upColor;
              //       }
              //   },
              // },
              },
            ]
          }
        }
        break;
    }
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
  searchScope: SearchScope = new SearchScope(10, 'Query');
  page: number = 0;
  error: string;
  categoryData:any=[];
  candleStickData:any=[];
  showQueryData(queryText) {
    this.tabLoading=true;
    queryText=this.widget.queryText
    this.customService.getQueryData(this.widget.type, queryText, this.page + 1, this.searchScope.pageSize).subscribe(
      res => {
        this.tabLoading=false;
        if(this.widget.type=='table'){
          this.tableData=[];
          this.tableData = res['data'];
          this.totalCount = res['count'];
          this.tableArray=[];
          Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
          }
          if (this.widget.type == 'cardChart' || this.widget.type == 'card') {
            this.graphDataGauge.value = res['value']
          }
          if (this.widget.type == 'gaugeChart') {
            this.graphDataGauge=[];
            this.graphDataGauge = res['value']
            this.previewOptions();
          }
          if (this.widget.type == 'barChart' || this.widget.type == 'lineChart' || this.widget.type=='multipleChart') {
            this.graphData1 = res['data'];
            this.graphHeader = res['headers'];
            this.previewOptions()
          }
          if (this.widget.type == 'pieChart' || this.widget.type == 'funnelChart' || this.widget.type == 'donutChart') {
            this.graphData2 = res['data'];
            this.previewOptions()
          }
          if(this.widget.type=='candleStick'){
            this.candleStickData=res['data']
            // console.log(this.candleStickData)
            this.previewOptions()
          }
      }, err => {
        this.error = err.error;
      }
    )
  }

  onPaginateChangeOfQuery(event: any) {
    this.searchScope.pageSize = event.pageSize;
    this.loadMoreGraphs = event.pageIndex;
    this.showQueryData(this.widget.queryText);
  }

  //Common Download method
  downloadAsFile(res: any, export_fileName: string, format: string) {
    let data = [res];
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyyMMdd_hhmmss');
    let type = ''
    var types;
    if (this.widget.type === 'table') {
      types = this.widget.graphSettings.tableName
    }
    else if (this.widget.type === 'card') {
      types = this.widget.graphSettings.labelName
    }
    else {
      types = this.widget.graphSettings.titleText
    }
    if (export_fileName == types && format == 'xlsx') {
      type = 'application/zip'
    }
    if (export_fileName == types && format == 'csv') {
      type = 'application/zip'
    }
    var blob = new Blob(data, { type: type + format });
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if (export_fileName == types && format == 'xlsx') {
      anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
    }
    else if (export_fileName == types && format == 'xls') {
      anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
    }
    else if (export_fileName == types && format == 'csv') {
      anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
    }
    anchor.href = url;
    anchor.click();
  }

  opensnackBar(message: any, action: any) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['success-snackbar'], duration: 5000,
      data: {
        message: message, icon: 'done', type: 'success', action: action
      }
    });
  }


  // widget: Widgets = new Widgets();

  downloadLayout(exportType: any) {
    this.savingByAccount = true;
    this.opensnackBar('Your Download has Started', null)
    let query;
    if (this.filterapply == true) {
      query = this.queryText
    }
    else {
      query = this.widget.queryText
    }
    this.downloadStatusSubscription = this.customService.getExportOfLayout(query, exportType, this.widget.id, this.widget.graphSettings.tableName).subscribe(
      res => {
        this.popup = true;
        this.currentDownloadJob = res;
        if (this.downloadStatusSubscription) {
          this.downloadStatusSubscription.unsubscribe();
        }
        this.downloadStatusSubscription = timer(0, 2000)
          .pipe(
            switchMap(() => {
              return this.customService.getJob(this.currentDownloadJob.id)
                .pipe(catchError(err => {
                  // Handle errors
                  return of(undefined);
                }));
            }),
            filter(data => data !== undefined)
          )
          .subscribe(data => {
            this.currentJob = data;
            if (this.currentJob?.isReady == true) {
              this.downloadStatusSubscription.unsubscribe();
              this.currentDownloadJob = null!;
              this.customService.getFilebyJob(this.currentJob?.id).subscribe(
                res => {
                  this.savingByAccount = false;
                  var type;
                  if (this.widget.type === 'table') {
                    type = this.widget.graphSettings.tableName
                  }
                  else if (this.widget.type === 'card') {
                    type = this.widget.graphSettings.labelName
                  }
                  else {
                    type = this.widget.graphSettings.titleText
                  }
                  this.downloadAsFile(res, type, exportType);
                  this.opensnackBar('Downloaded Successfully', 1000);
                  this.popup = false;
                },
                err => {
                  this.savingByAccount = false;
                  this.opensnackBar('Failed to download file. Refer console for more details.', null);
                }
              )
            }
          });
      }
    )
  }
  searchScopeOfGraph: SearchScope = new SearchScope(10, 'graph')
  pageSizeIndexOfGraph = [];
  loadMore: boolean = false;
  pageNum = [];
  pageNumber = [];
  graphCount: number;
  loadMorePie: number = 1;
  loadMoreFunnel: number = 1;
  loadMoreDonut: number = 1;
  loadMoreGraphs: number = 1;
  loadMoreLine: number = 1;
  loadMoreCandle:number = 1;
  loadPrevPage: boolean = false;
  fieldValueCount:any;
  loadMoreGraph() {
    this.tabLoading = true;
    this.isLoading = true;

    if (this.loadMore == true && this.widget?.type == 'barChart') {
      this.loadMoreGraphs = this.loadMoreGraphs + 1;
    }
    if (this.loadMore == true && this.widget?.type == 'pieChart') {
      this.loadMorePie = this.loadMorePie + 1;
    }
    if (this.loadMore == true && this.widget?.type == 'funnelChart') {
      this.loadMoreFunnel = this.loadMoreFunnel + 1;
    }
    if (this.loadMore == true && this.widget?.type == 'donutChart') {
      this.loadMoreDonut = this.loadMoreDonut + 1;
    }
    if (this.loadMore == true && this.widget?.type == 'lineChart') {
      this.loadMoreLine = this.loadMoreLine + 1;
    }
    if(this.loadMore==true && this.widget?.type=='candleStick'){
      this.loadMoreCandle=this.loadMoreCandle + 1;
    }
    let type;
    if (this.threeDim == true) {
      type = this.optionsthreeDim?.chart?.type
    }
    else {
      type = this.widget.type
    }
    if (type == 'pie') {
      type = 'pieChart'
    }
    if (type == 'funnel3d') {
      type = 'funnelChart'
    }
    if (this.widget?.type == 'donutChart') {
      type = 'donutChart'
    }
    if (this.widget?.type == 'barChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreGraphs = this.loadMoreGraphs - 2;
      }
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreGraphs + 1, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let headers: any[] = [];
          headers = res['headers'];
          let dataOfBar: any[] = [];
          dataOfBar = res['data'];
          if (this.loadPrevPage == true) {
            this.widget?.actualData?.data?.splice(-10, this.widget?.actualData?.data?.length)
            this.widget?.actualData?.headers?.splice(-10, this.widget?.actualData?.headers?.length)
          } else {
            dataOfBar?.forEach(e => {
              this.widget.actualData.data?.push(e)
            })
            headers?.forEach(e => {
              this.widget?.actualData?.headers?.push(e)
            })
          }
          this.previewOptions();
          this.loadPrevPage = false;
          this.fieldValueCount=dataOfBar?.length;
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget?.type == 'pieChart') {
      if (this.loadPrevPage == true) {
        this.loadMorePie = this.loadMorePie - 2;
      }
      this.customService.getQueryData(type, this.widget.queryText, this.loadMorePie + 1, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let dataPie: any[] = [];
          dataPie = res['data'];
          this.graphCount = res['count'];
          if (this.loadPrevPage == true) {
            this.widget.actualData?.data?.splice(-10, this.widget?.actualData?.data?.length)
          } else {
            dataPie?.forEach(e => {
              this.widget.actualData.data?.push(e)
            })
          }
          if (this.threeDim == true) {
            this.preview3dOptions('pieChart')
          }
          else {
            this.previewOptions();
          }
          this.loadPrevPage = false;
          this.fieldValueCount=dataPie?.length;
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget.type == 'funnelChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreFunnel = this.loadMoreFunnel - 2;
      }
      this.customService.getQueryData(type, this.widget.queryText, this.loadMoreFunnel + 1, this.searchScopeOfGraph.pageSize).subscribe(
        (res) => {
          this.isLoading = false;
          let data: any[] = [];
          data = res['data'];
          if (this.loadPrevPage == true) {
            this.widget.actualData?.data?.splice(-10, this.widget?.actualData?.data?.length)
          } else {
            data?.forEach(e => {
              this.widget.actualData.data?.push(e)
            })
          }
          if (this.threeDim == true) {
            this.preview3dOptions('funnelChart')
          }
          else {
            this.previewOptions();
          }
          this.loadPrevPage = false;
          this.fieldValueCount=data?.length;
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget.type == 'donutChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreDonut = this.loadMoreDonut - 2;
      }
      this.customService.getQueryData(type, this.widget.queryText, this.loadMoreDonut + 1, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let dataOfDonut: any[] = [];
          dataOfDonut = res['data'];
          if (this.loadPrevPage == true) {
            this.widget.actualData?.data?.splice(-10, this.widget?.actualData?.data?.length)
          } else {
            dataOfDonut?.forEach(e => {
              this.widget.actualData.data?.push(e)
            })
          }
          if (this.threeDim == true) {
            this.preview3dOptions('pieChart')
          }
          else {
            this.previewOptions();
          }
          this.loadPrevPage = false;
          this.fieldValueCount=dataOfDonut?.length;
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget.type == 'lineChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreLine = this.loadMoreLine - 2;
      }
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreLine + 1, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let headersOfLine: any[] = [];
          headersOfLine = res['headers'];
          let dataOfLine: any[] = [];
          dataOfLine = res['data']
          if (this.loadPrevPage == true) {
            this.widget?.actualData?.data?.splice(-10, this.widget?.actualData?.data?.length)
            this.widget?.actualData?.headers?.splice(-10, this.widget?.actualData?.headers?.length)
          } else {
            dataOfLine?.forEach(e => {
              this.widget.actualData.data?.push(e)
            })
            headersOfLine?.forEach(e => {
              this.widget?.actualData?.headers?.push(e)
            })
          }
          this.previewOptions();
          this.loadPrevPage = false;
          this.fieldValueCount=dataOfLine?.length;
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if(this.widget.type=='candleStick'){
      if(this.loadPrevPage==true){
        this.loadMoreCandle=this.loadMoreCandle - 2;
      }
      this.customService.getQueryData(this.widget.type,this.widget.queryText,this.loadMoreCandle + 1,this.searchScopeOfGraph.pageSize).subscribe(
        res=>{
          this.isLoading=false;
          let data:any[]=[];
          data=res['data'];
          if(this.loadPrevPage==true){
            this.widget?.actualData?.data.splice(-10,this.widget?.actualData?.data?.length)
          }else{
            data?.forEach(e=>{
              this.widget.actualData?.data?.push(e)
            })
          }
          this.previewOptions()
          this.loadPrevPage=false;
          this.fieldValueCount=data?.length;
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
  }
  }
  clearFilter() {
    this.tabLoading = true;
    this.isLoading = true;
    this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
      (res: any) => {
        this.tabLoading = false;
        this.isLoading = false;
        if (this.widget.type == 'table') {
          this.tableData = res['data'];
          this.totalCount = res['count']
          this.tableArray = [];
          Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
        }
      }
    )
    if (this.widget?.type == 'card' || this.widget?.type == 'cardChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.graphDataGauge.value = res['value']
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget?.type == 'gaugeChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.graphDataGauge = res['value']
          this.previewOptions()
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget?.type == 'barChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let headers: any[] = [];
          headers = res['headers'];
          headers?.forEach(e => {
            this.graphHeader?.push(e)
          })
          let dataOfBar: any[] = [];
          dataOfBar = res['data'];
          dataOfBar?.forEach(e => {
            this.graphData1?.push(e)
          })
          this.previewOptions();
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget?.type == 'pieChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMorePie, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let dataPie: any[] = [];
          dataPie = res['data'];
          this.graphCount = res['count'];
          dataPie?.forEach(e => {
            this.graphData2?.push(e)
          })
          this.previewOptions();
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget.type == 'funnelChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreFunnel, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let data: any[] = [];
          data = res['data'];
          data?.forEach(e => {
            this.graphData2?.push(e)
          })
          this.previewOptions();
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget.type == 'donutChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreDonut, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let dataOfDonut: any[] = [];
          dataOfDonut = res['data'];
          dataOfDonut?.forEach(e => {
            this.graphData2?.push(e)
          })
          this.previewOptions();
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if (this.widget.type == 'lineChart') {
      this.customService.getQueryData(this.widget.type, this.widget.queryText, this.loadMoreLine, this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let headersOfLine: any[] = [];
          headersOfLine = res['headers'];
          headersOfLine?.forEach(e => {
            this.graphHeader?.push(e)
          })
          let dataOfLine: any[] = [];
          dataOfLine = res['data']
          dataOfLine?.forEach(e => {
            this.graphData1?.push(e)
            this.previewOptions()
          })
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
    if(this.widget.type=='candleStick'){
      this.customService.getQueryData(this.widget.type,this.widget.queryText,this.loadMoreCandle + 1,this.searchScopeOfGraph.pageSize).subscribe(
        (res: any) => {
          this.isLoading = false;
          let data: any[] = [];
          data = res['data'];
          data?.forEach(e => {
            this.graphData2?.push(e)
          })
          this.previewOptions();
        },err=>{
          this.isLoading=false;
          console.log(err.error)
        }
      )
    }
  }
  give3dCharts(typechart) {
    this.threeDim=false;
    const chart = echarts?.init(document.getElementById('container'));
    chart.setOption({
      grid3D: {
        alpha:90,
        beta:0,
      },
      xAxis3D: {},
      yAxis3D: {},
      zAxis3D: {},
      series: [
        {
          type: typechart, // Corrected series type
          data: this.widget?.actualData?.data,
          headers: this?.widget?.actualData?.headers,
          // radius: 30,
          // perspective:100,
          // shading: 'color', // Specify the shading mode (you can change this)
          label: {
            show: true,
            textStyle: {
              fontSize: 16,
            },
          },
          emphasis: {
            label: {
              textStyle: {
                fontSize: 20,
              },
              itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
            },
          },
        },
      ],
    });  
  }
  optionsthreeDim: any = [];
  preview3dOptions(typeOfChart) {
    if (this.widget?.type !== 'table') {
      this.threeDim = true;
      let seriesData
      const chartData = this.widget?.actualData?.data;
      const pieData = chartData?.map(item => [item.name, item.value]);
      const donutData = chartData?.map(item => [item.name, item.value]);
      if(this.chartType == 'pieChart' || this.chartType == 'donutChart' || this.chartType == 'funnelChart'){
        seriesData=chartData?.map(item => [item.name, item.value]);
      }
      else{
        seriesData=chartData;
      }
      switch (typeOfChart) {
        case"multipleChart":{
          this.optionsthreeDim = {
            chart: {
              type: 'column',
              styledMode:true,
              options3d: {
                enabled: true,
                alpha: 14,
                beta: 0,
              }
            },
            xAxis:{
              categories:this.widget?.actualData?.headers
            },
            title: {
              text: this.widget?.graphSettings?.titleText,
            },
            credits: {
              enabled: false
            },
            accessibility: {
              enabled: false,
            },
            series: [{
              type: 'column',
              name: 'Bar',
              data: seriesData,
            },
            {
              type: 'line',
              name: 'Line',
              data: seriesData,
            }
          ]
          };
          break;
        }
        case "barChart":{
          this.optionsthreeDim = {
            chart: {
              type: 'column',
              styledMode:true,
              options3d: {
                enabled: true,
                alpha: 14,
                beta: 0,
                depth:50
              }
            },
            xAxis:{
              categories:this.widget?.actualData?.headers
            },
            title: {
              text: this.widget?.graphSettings?.titleText,
            },
            credits: {
              enabled: false
            },
            accessibility: {
              enabled: false,
            },
            series: [{
              type: 'column',
              name: 'Bar',
              data: seriesData
            }]
          };
          break;
        }
        case "lineChart":{
          this.optionsthreeDim = {
            chart: {
              type: 'line',
              styledMode:true,
              options3d: {
                enabled: true,
                alpha: 14,
                beta: 0,
              }
            },
            xAxis:{
              categories:this.widget?.actualData?.headers
            },
            title: {
              text: this.widget?.graphSettings?.titleText,
            },
            credits: {
              enabled: false
            },
            accessibility: {
              enabled: false,
            },
            series: [{
              type: 'line',
              name: 'Line',
              data: seriesData
            }]
          };
          break;
        }
        case "pieChart": {
          this.optionsthreeDim = {
            chart: {
              type: 'pie',
              styledMode:true,
              inverted: true,
              options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
              }
            },
            title: {
              text: this.widget?.graphSettings?.titleText,
            },
            credits: {
              enabled: false
            },
            accessibility: {
              enabled: false,
            },
            plotOptions: {
              pie: {
                depth: 60,
                dataLabels: {
                  enabled: true,
                },
                cumulative: 0
              }
            },
            series: [{
              type: 'pie',
              name: 'Pie',
              data: pieData,
            }]
          };
          break;
        }
        case "donutChart": {
          this.optionsthreeDim = {
            chart: {
              type: 'pie',
              styledMode:true,
              options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
              }
            },
            title: {
              text: this.widget?.graphSettings?.titleText,
            },
            credits: {
              enabled: false
            },
            accessibility: {
              enabled: false,
            },
            plotOptions: {
              pie: {
                innerSize: 100,
                depth: 45,
                dataLabels: {
                  enabled: true,
                }
              }
            },
            series: [{
              type: 'pie',
              name: 'Pie',
              data: donutData,
            }]
          };
          break;
        }
        case 'funnelChart': {
          this.optionsthreeDim = {
            chart: {
              type: 'funnel3d',
              styledMode:true,
              options3d: {
                enabled: true,
                alpha: 10,
                depth: 50,
                viewDistance: 50,
              }
            },
            title: {
              text: this.widget?.graphSettings?.titleText
            },
            credits: {
              enabled: false
            },
            accessibility: {
              enabled: false,
            },
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                  allowOverlap: true,
                  y: 10
                },
                neckWidth: '30%',
                neckHeight: '25%',
                width: '50%',
                height: '50%'
              }
            },
            series: [{
              name: 'Unique users',
              data: pieData
            }]
          };
          break;
        }
        case "timeline": {
          this.optionsthreeDim = {
            chart: {
              zoomType: 'x',
              type: 'timeline',
            },
            xAxis: {
              type: 'datetime',
              visible: false,
            },
            yAxis: {
              gridLineWidth: 1,
              title: null,
              labels: {
                enabled: false,
              },
            },
            legend: {
              enabled: false,
            },
            credits: {
              enabled: false
            },
            title: {
              text: this.widget?.graphSettings?.titleText,
            },
            tooltip: {
              style: {
                width: 300,
              },
            },
            series: [
              {
                dataLabels: {
                  allowOverlap: false,
                  format: '<span style="color:{point.color}">● </span><span style="font-weight: bold;" > ' +
                    '{point.x:%d %b %Y}</span><br/>{point.label}'
                },
                marker: {
                  symbol: 'circle'
                },
                // data: pieData.map(([name, value]) => ({ name, value })),
                data: pieData.map(([name, value]) => ({
                  x: value,
                  name: value,
                  label: name,
                  y: value,
                }))
                // data: [{
                // x: Date.UTC(2023, 9, 10),
                // name: 'Physically Purged Trade ID',
                // label: 'Physically Purged Date',
                // description: 'The particular Trade ID 26953135 is physically purged'
                // }, {
                // x: Date.UTC(2023, 9, 11),
                // name: 'Physically Purged Trade ID',
                // label: 'Physically Purged Date',
                // description: 'The particular Trade ID 26953135 is physically purged'
                // }, {
                // x: Date.UTC(2023, 9, 12),
                // name: 'Physically Purged Trade ID',
                // label: 'Physically Purged Date',
                // description: 'The particular Trade ID 26953135 is physically purged'
                // }, {
                // x: Date.UTC(2023, 9, 13),
                // name: 'Physically Purged Trade ID',
                // label: 'Physically Purged Date',
                // description: 'The particular Trade ID 26953135 is physically purged'
                // }, {
                // x: Date.UTC(2023, 9, 14),
                // name: 'Physically Purged Trade ID',
                // label: 'Physically Purged Date',
                // description: 'The particular Trade ID 26953135 is physically purged'
                // }, {
                // x: Date.UTC(2023, 9, 15),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 16),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 17),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 18),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 19),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 20),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 21),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }, {
                // x: Date.UTC(2023, 9, 22),
                // name: 'Logically Purged Trade ID',
                // label: 'Logically Purged Date',
                // description: 'The particular Trade ID 26953135 is Logically purged'
                // }]
              },
            ],
          };

          break;
        }
        default:
          console.error(`Unsupported chart type: ${this.widget?.type}`);
          break;
      }
    }
  }
  giveMultipleCharts() {
    const actualData = this.widget.actualData?.data;
    const labels = actualData.map(item => item.label);
    const values = actualData.map(item => item.value);
    const names = actualData.map(item => item.name);
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    this.previewOption = {
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
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      title: {
        text: this.widget.graphSettings.titleText
      },
      legend: {
        data: [this.widget.graphSettings.legendName]
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          // prettier-ignore
          data: names,
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
          type: 'bar',
          data: labels,
        },
        {
          type: 'bar',
          yAxisIndex: 1,
          data: values,
        },
        {
          type: 'line',
          yAxisIndex: 1,
          data: values,
        },
      ]
    };
  }
  deleteExport(id: any) {
    this.customService.getDeleteExport(id).subscribe(
      (res: any) => {
        this.opensnackBar(res['status'], null)
      }
    )
  }
  cancelExport() {
    this.popup = false;
    this.savingByAccount = false;
    this.downloadStatusSubscription?.unsubscribe();
  }
  ngOnDestroy(): void {
    this.themeData = [];
    if (this.currentJob?.id !== null && this.currentJob?.id !== undefined && this.savingByAccount == true) {
      this.deleteExport(this.currentJob?.id);
      this.cancelExport();
    }
  }
gettextColor(id){
  return this.colorService.getTextColor(id);
}
gettheme(id){
  return this.colorService.getColorArray(id);
}
getuserColor(id) {
  return this.colorService.getBckColor(id);
}
}