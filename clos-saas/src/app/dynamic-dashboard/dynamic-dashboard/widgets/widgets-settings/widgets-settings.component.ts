import { I } from '@angular/cdk/keycodes';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { GraphSetting, SearchScope, Widgets } from '../../models/model';
import { CustomServiceService } from '../../service/custom-service.service';
import { QueryBuliderComponent } from '../query-bulider/query-bulider.component';
import { WidgetsComponent } from '../widgets.component';
import { TemplateWidgetsComponent } from '../../custom-mapping/template-widgets/template-widgets.component';
import * as echarts from 'echarts';
import * as Highcharts from 'highcharts';
import { ColorService } from '../../color-service';
import { ExtractionQueryDetailComponent } from 'src/app/reports/report-portal/developer-tools/modals/extraction-query-detail/extraction-query-detail.component';
import { QueryDetailComponent } from '../../query-detail/query-detail.component';

@Component({
  selector: 'app-widgets-settings',
  templateUrl: './widgets-settings.component.html',
  styleUrls: ['./widgets-settings.component.scss']
})
export class WidgetsSettingsComponent implements OnInit {

  widget: Widgets = new Widgets();
  @Input() type: any;
  previewOption;
  panelName: string = "";
  step = 0;
  widgetComponent: boolean = false;
  tableName: string
  allTableNames: string[];
  allTableColumns: string[];
  columnNameOne: string;
  columnNameTwo: string;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  borderColor: boolean = true;
  darkBkcolor:string='';
  lightBkcolor:string='';
  cardleft:string='';
  cardright:string='';
  cardtop:string='';
  cardbottom:string='';
  cardcolor:string='';
  cardtxt:string='';
  layoutid:string;
  graphHeader: string[] = ['', '', ''];
  graphData1: number[] = [50, 200, 100];
  graphData2: any[] = [
    { value: 60, name: 's1' },
    { value: 40, name: 's2' },
    { value: 20, name: 's3' }
  ]
  graphDataGauge:any=90;
  tableData: any;
  tableArray = [];
  tabLoading:boolean=false;
  graphDataMultiple:any=[50,20,100];
  highcharts=Highcharts;
  categoryData=['2024', '1987', '2023', '2022'];
  candleStickData=[[20, 34, 10, 38],
  [40, 35, 30, 50],
  [31, 38, 33, 44],
  [38, 15, 5, 42]
]
resultData:any=[];
  constructor(
    private colorService: ColorService,
    public dialogRef: MatDialogRef<TemplateWidgetsComponent>,
    private url: UrlService,
    public dialog: MatDialog,
    public customService: CustomServiceService,
    @Inject(MAT_DIALOG_DATA) public layoutData: any,
  ) {
    this.layoutid = layoutData.layoutID;
    this.panelName = layoutData.panelName;
    if (layoutData.widget == null) {
      this.widget.graphSettings = new GraphSetting();
      this.widget.graphSettings.titleShow = true;
      this.widget.graphSettings.titleText = 'Graph Name';
      this.widget.graphSettings.titleAlign = "left";
      this.widget.graphSettings.legendAlign = "left";
      this.widget.graphSettings.legendOrient = "horizontal"
      this.widget.graphSettings.legendShow = true;
      this.widget.graphSettings.legendName = "one";
      this.widget.graphSettings.legendName2 = "two";
      this.widget.graphSettings.legendName3 = "three";
      this.widget.graphSettings.toolTipTrigger = "item";
      this.widget.graphSettings.toolTipShow = true;
      this.widget.graphSettings.xaxis = "category";
      this.widget.graphSettings.yaxis = "value";
      this.widget.graphSettings.radius = '70';
      this.widget.graphSettings.outerRadius = '100';
      this.widget.graphSettings.innerRadius = '50';
      this.widget.graphSettings.labelPosition = 'outside';
      this.widget.graphSettings.labelShow = true;
      this.widget.graphSettings.toolboxShow = true;
      this.widget.graphSettings.labelLineShow = true;
      this.widget.graphSettings.toolboxZoom = true;
      this.widget.graphSettings.toolboxData = true;
      this.widget.graphSettings.toolboxType = true;
      this.widget.graphSettings.toolboxSave = true;
      this.widget.graphSettings.cardTextColor = '#000';
      this.widget.graphSettings.cardColor = '#9e99996b';
      this.widget.graphSettings.labelName = "Label";
      this.widget.graphSettings.borderTopColor = "#000";
      this.widget.graphSettings.topThickness = 1;
      this.widget.graphSettings.borderBottomColor = "#000";
      this.widget.graphSettings.bottomThickness = 1;
      this.widget.graphSettings.borderLeftColor = "#000";
      this.widget.graphSettings.leftThickness = 1;
      this.widget.graphSettings.borderRightColor = "#000";
      this.widget.graphSettings.rightThickness = 1;
      this.widget.graphSettings.tableName = 'Table Name';
    } else {
      this.widget = layoutData.widget;
      this.widget.actualData = JSON.parse(layoutData.widget.data);
    }

  }
  typeOfvar:any=''

  public updateUrl(): Promise<any> {
    return this.url.getUrl().toPromise().then();
  }
  async ngOnInit() {
    this.gettextColor(this.layoutid)
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
    let response = await this.updateUrl();
    UrlService.API_URL = response?.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    if (this.layoutData.widget == null) {
      this.widget.type = this.type;
      this.previewOptions()
    } else {
      this.widget.type = this.layoutData.widget.type;
      this.chooseType();
      let session=sessionStorage.getItem('result')
      this.resultData=session
      // if(this.widget.type=='gaugeChart' && typeof(this.graphDataGauge.value)==='string'){
      //   this.widget.query.columnName1=[]
      // }
    }
    console.log(this.widget.query,this.widget.id)
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
   if (this.page < totalPages) {
     this.page++;
   }
 }
 isLastPage(): boolean {
  const totalCount = this.totalCount;
  const pageSize = this.searchScope.pageSize;

   const totalPages = Math.ceil(totalCount / pageSize);
   return this.page === totalPages;
 }
 typeOfCreation:any='';
 getTypeOfCreation:any=''

  //Open dialog to edit
  queryBuilder() {
    var legend: string = null;
    console.log(this.resultData)
    if (this.widget.type == 'barChart' || this.widget.type == 'lineChart') {
      legend = this.widget.graphSettings.legendName
    }
    this.typeOfCreation='QUERYBUILDER'
    sessionStorage.setItem('Query',this.typeOfCreation)
    this.getTypeOfCreation=sessionStorage.getItem('Query')
    // if(this.widget.type!=='candleStick'){
    const dialogRef = this.dialog.open(QueryBuliderComponent, {
      width: '1200px',
      height: '810px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop:true,
      disableClose: true,
      data: { widget: this.widget, chartType: this.widget.type, legend: legend }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.widget.actualData = result[0];
      this.widget.queryText = result[1];
      this.widget.query = result[2];
      this.widget.graphSettings.xaxis = sessionStorage.getItem('xaxis')
      this.widget.graphSettings.yaxis = sessionStorage.getItem('yaxis')
      if (this.widget.actualData != null) {
        this.chooseType();
      }
      if(this.widget.type=='cardChart'|| this.widget.type=='card'){
        this.graphDataGauge=result[0]['value']
      }
    });
  // }
  // if(this.widget.type=='candleStick'){
  //   const dialogRef = this.dialog.open(QueryDetailComponent, {
  //     width: '1200px',
  //     height: '810px',
  //     panelClass: 'dialog-theme-light',
  //     backdropClass: 'backdropBackground-theme-light',
  //     hasBackdrop:true,
  //     disableClose: true,
  //     data: { tableData: this.widget, type: this.widget.type, legend: legend }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //    this.widget.actualData = result[0];
  //    this.widget.type=result[1]
  //    this.widget.queryText = result[2];
  //    if (this.widget.actualData != null||this.widget.!==0) {
  //     this.chooseType();
  //   }
  //   });
  // }
  }
  queryBuilderOfExtractionQuery() {
    var legend: string = null;
    if (this.widget.type == 'barChart' || this.widget.type == 'lineChart') {
      legend = this.widget.graphSettings.legendName
    }
    this.typeOfCreation='QUERYDETAIL';
    sessionStorage.setItem('Query',this.typeOfCreation)
    this.getTypeOfCreation=sessionStorage.getItem('Query');
    if(this.widget.type!=='candleStick'){
    const dialogRef = this.dialog.open(QueryDetailComponent, {
      width: '1200px',
      height: '810px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop:true,
      disableClose: true,
      data: { tableData: this.widget, type: this.widget.type, legend: legend }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.resultData=result;
      sessionStorage.setItem('result',result)
      console.log(this.resultData,this.resultData?.length)
      this.widget.actualData = result[0];
      console.log(this.resultData)
      this.widget.type=result[1]
      this.widget.queryText = result[2];
      this.widget.query=null;
      this.widget.graphSettings.xaxis = sessionStorage.getItem('xaxis')
      this.widget.graphSettings.yaxis = sessionStorage.getItem('yaxis')
      if (this.widget.actualData != null) {
        this.chooseType();
      }
      if(this.widget.type=='cardChart'|| this.widget.type=='card'){
        this.graphDataGauge=result[0]['value']
      }
    });
  }
  if(this.widget.type=='candleStick'){
    const dialogRef = this.dialog.open(QueryDetailComponent, {
      width: '1200px',
      height: '810px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop:true,
      disableClose: true,
      data: { tableData: this.widget, type: this.widget.type, legend: legend }
    });
    dialogRef.afterClosed().subscribe(result => {
     this.widget.actualData = result[0];
     this.widget.type=result[1]
     this.widget.queryText = result[2];
     this.widget.query=null;
     if (this.widget.actualData != null||this.widget.actualData.length!==0) {
      this.chooseType();
    }
    });
  }
  console.log(this.widget,'query-details')
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
  queryText:any;

  saveNewWidget() {
    this.dialogRef.close({ widget: this.widget, panelName: this.panelName });
    this.showQueryData(this.queryText);
  }

  clearBorder() {
    if (this.borderColor == false) {
      this.widget.graphSettings.topThickness = 0;
      this.widget.graphSettings.bottomThickness = 0;
      this.widget.graphSettings.leftThickness = 0;
      this.widget.graphSettings.rightThickness = 0;
    }
    else {
      this.widget.graphSettings.topThickness = 1;
      this.widget.graphSettings.bottomThickness = 1;
      this.widget.graphSettings.leftThickness = 1;
      this.widget.graphSettings.rightThickness = 1;
    }
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
    if (this.widget.graphSettings.labelPosition == 'inside') {
      this.widget.graphSettings.labelLineShow = false
    }
    switch (this.widget.type) {
      case "lineChart":
        this.previewOption = {
          title: {
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
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.widget.graphSettings.toolTipTrigger,
            formatter: (params) => {
              return '<span>' + params.seriesName + '</span><br><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + params.color + '"></span>' + params.name + ' : <b>' + Number(Math.round(parseFloat(params.value) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</b>';
            },
            position: function (point, params, dom, rect, size) {
              var obj = { top: point[1] };
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
              restore: { show: this.widget.graphSettings.toolboxType },
              saveAsImage: { show: this.widget.graphSettings.toolboxSave }
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
              formatter: (value) => {
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
        this.previewOption = {
          title: {
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
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.widget.graphSettings.toolTipTrigger
          },
          legend: {
            show: this.widget.graphSettings.legendShow,
            type: 'scroll',
            bottom:10,
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
              radius: this.widget.graphSettings.radius,
              label: {
                show: this.widget.graphSettings.labelShow,
                position: this.widget.graphSettings.labelPosition
              },
              labelLine: {
                show: this.widget.graphSettings.labelLineShow
              },
              data: this.graphData2,
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
        this.previewOption = {
          title: {
            show: this.widget.graphSettings.titleShow,
            text: this.widget.graphSettings.titleText,
            top: -4,
            textStyle: {
              color: this.gettextColor(this.layoutid)
            },
            // label: {
            //   fontSize:'10',
            // },
            left: this.widget.graphSettings.titleAlign
          },
          color:this.gettheme(this.layoutid),
          series: [{
            // name: isNaN(this.graphDataGauge) ? '' : this?.widget?.query?.columnName1?.toString(),
            top: -10,
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
              show: false,
            },
            axisLabel: {
              show: false,
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
          title: {
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
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
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
                position: this.widget.graphSettings.labelPosition
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
          title: {
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
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
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
              name: 'Funnel',
              type: 'funnel',
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
                position: this.widget.graphSettings.labelPosition
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
          title: {
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
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.widget.graphSettings.toolTipTrigger,
            formatter: (params) => {
              return '<span>' + params.seriesName + '</span><br><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + params.color + '"></span>' + params.name + ' : <b>' + Number(Math.round(parseFloat(params.value) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</b>';
            },
            position: function (point, params, dom, rect, size) {
              var obj = { top: point[1] };
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
              restore: { show: this.widget.graphSettings.toolboxType, },
              saveAsImage: { show: this.widget.graphSettings.toolboxSave, }
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
            type: this.widget.graphSettings.xaxis,
            data: this.graphHeader
          },
          yAxis: {
            type: this.widget.graphSettings.yaxis,
            axisLabel: {
              formatter: (value) => {
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
            name: this.widget.graphSettings.legendName,
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
        case "multipleChart":{
          const actualData = this.widget?.actualData?.data;
          if(this.widget.actualData!==undefined){
          let xaxis,bar1,bar2,line;
           xaxis = actualData.map(item => item.name);
           bar1 = actualData.map(item => item.label);
           bar2 = actualData.map(item => item.value2);
           line = actualData.map(item => item.value);
          
          const colors = ['#5470C6', '#91CC75', '#EE6666'];  
          this.previewOption = {
            title: {
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
              backgroundColor: bg == 'theme-light' ? 'white' : 'black',
              trigger: this.widget.graphSettings.toolTipTrigger,
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              right: '20%'
            },
            toolbox: {
              top:'15',
              right:'30',
              show: this.widget.graphSettings.toolboxShow,
              feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            label: {
              show: this.widget.graphSettings.labelShow,
              position: this.widget.graphSettings.labelPosition
            },
            labelLine: {
              show: this.widget.graphSettings.labelLineShow
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
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                // prettier-ignore
                data: xaxis,
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
                color:this.gettheme(this.layoutid) ? this.gettheme(this.layoutid)[0] : colors[0]
              },
              {
                name: this.widget.graphSettings.legendName2,
                type: 'bar',
                yAxisIndex: 1,
                data: bar2,
                color:this.gettheme(this.layoutid) ? this.gettheme(this.layoutid)[1] : colors[1]
              },
              {
                name: this.widget.graphSettings.legendName3,
                type: 'line',
                yAxisIndex: 1,
                data: line,
                color:this.gettheme(this.layoutid) ? this.gettheme(this.layoutid)[2] : colors[2]
              },
            ]
          }
        }
        else{
          this.previewOption = {
            title: {
              text: 'MULTIPLE-CHART',
            },
            grid: {
              right: '20%'
            },
            toolbox: {
              top:'15',
              right:'30',
              feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            legend: {
              textStyle: {
                color: '#777',
                textShadowColor: '#777',
                textShadowOffsetX: 1,
              }
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                // prettier-ignore
                data: this.graphHeader,
              }
            ],
            yAxis: [
              {
                type: 'value',
                position: 'right',
                alignTicks: true,
                axisLine: {
                  show: true,
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
                  show: true
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
                },
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                type: 'bar',
                data: this.graphData1,
              },
              {
                type: 'bar',
                yAxisIndex: 1,
                data: this.graphDataMultiple,
              },
              {
                type: 'line',
                yAxisIndex: 1,
                data: this.graphData1,
              },
            ]
          };
        }
      }
          break; 
          case "candleStick": {
            let upColor = '#00da3c';
            let downColor = '#ec0000';
            let col;
            const actualData = this.widget?.actualData?.data;
            if(this.widget.actualData!==undefined){
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
                show: this.widget.graphSettings.titleShow,
                text: this.widget.graphSettings.titleText,
                left: this.widget.graphSettings.titleAlign,
                textStyle: {
                  color: this.gettextColor(this.layoutid)
                }
              },
              animation: false,
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
              
                //           // Determine the color for the first bar
                //           return firstClose > firstOpen ? upColor : downColor;
                //       } else if (dataIndex > 0) {
                //           const currentOpen = this.candleStickData[dataIndex][0];
                //           const currentClose = this.candleStickData[dataIndex][1];
                //           const previousClose = this.candleStickData[dataIndex - 1][1];
              
                //           // Check if open and close are equal
                //           if (currentOpen === currentClose) {
                //               // Compare the current close and previous close
                //               return currentClose > previousClose ? upColor : downColor;
                //           } else {
                //               // Compare the current close and current open
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
          else{
            this.previewOption = {
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
          }
          break;
      }
  }
  splitData(rawData) {
    let categoryData = [];
    let values = [];
    let volumes = [];
    
    for (let i = 0; i < rawData.length; i++) {
        const [x, open, close, low, high, volume, color] = rawData[i];
        
        // Assuming x is the category, adjust accordingly if it's different
        categoryData.push(x);

        // Assuming open, close, low, high are in order
        values.push([open, close, low, high]);

        // Assuming volume is at index 4 and color at index 5
        volumes.push([i, volume, open > close ? -1 : 1, color]); // Adjusted for volume data
    }

    return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
    };
}

  calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data[i - j][1];
      }
      result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
  }
  searchScope: SearchScope = new SearchScope(10, 'Query');
  page: number = 0;
  totalCount: number;
  error: string;
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
            this.widget.actualData.data=res['data']
            this.previewOptions()
          }
      }, err => {
        this.error = err.error;
      }
    )
  }


  onPaginateChangeOfQuery(event) {
    this.searchScope.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.showQueryData(this.queryText);
  }
  getuserColor(id) {
    return this.colorService.getBckColor(id);
  }
  changeheaderColor(){
    this.colorService.setthColor(this.layoutid,this.darkBkcolor);
  }
  changebodyColor(){
    this.colorService.settbColor(this.layoutid,this.lightBkcolor);
  }
  changecardtopColor(){
    this.colorService.setcardtColor(this.layoutid,this.cardtop)
  }
  changecardbottomColor(){
    this.colorService.setcardbColor(this.layoutid,this.cardbottom)
  }
  changecardleftColor(){
    this.colorService.setcardlColor(this.layoutid,this.cardleft)
  }
  changecardrightColor(){
    this.colorService.setcardrColor(this.layoutid,this.cardright)
  }
  changecardColor(){
    this.colorService.setcardColor(this.layoutid,this.cardcolor)
  }
  changecardtxtColor(){
    this.colorService.setcardTxt(this.layoutid,this.cardtxt)
  }
  gettheme(id){
    return this.colorService.getColorArray(id);
  }
  textcolor:any='';
  gettextColor(id){
    this.textcolor = this.colorService.getTextColor(id);
    if(this.textcolor=='#eeeeee'){
      console.log(this.textcolor)
      this.textcolor='black';
    }
  }
}
