import { Component, HostListener, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomiseDashboard, GridStackElement, QueryFieldCustomDashBoard, SearchScope, Widgets } from 'src/app/dynamic-dashboard/dynamic-dashboard/models/model';
import { CustomServiceService } from 'src/app/dynamic-dashboard/dynamic-dashboard/service/custom-service.service';
import * as echarts from 'echarts';
import { GridStack } from 'gridstack';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ColorService } from 'src/app/dynamic-dashboard/dynamic-dashboard/color-service';
import { WidgetsComponent } from 'src/app/dynamic-dashboard/dynamic-dashboard/widgets/widgets.component';
import { WidgetsSettingsComponent } from 'src/app/dynamic-dashboard/dynamic-dashboard/widgets/widgets-settings/widgets-settings.component';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { MatPaginator } from '@angular/material/paginator';
import { TableQueryFilterComponent } from 'src/app/dynamic-dashboard/dynamic-dashboard/widgets/table-query-filter/table-query-filter.component';
import { WidgetsScreenComponent } from 'src/app/dynamic-dashboard/dynamic-dashboard/widgets/widgets-screen/widgets-screen.component';
import { DatePipe, Location } from '@angular/common';
import { ExistingWidgetComponent } from 'src/app/dynamic-dashboard/dynamic-dashboard/widgets/existing-widget/existing-widget.component';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateMappingComponent } from 'src/app/dynamic-dashboard/dynamic-dashboard/custom-mapping/template-mapping/template-mapping.component';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { DownloadJob } from 'src/app/data-entry/services/download-service';

@Component({
  selector: 'app-dashboardpopup',
  templateUrl: './dashboardpopup.component.html',
  styleUrls: ['./dashboardpopup.component.scss']
})
export class DashboardpopupComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  queryField: QueryFieldCustomDashBoard = new QueryFieldCustomDashBoard(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  customLayout = new CustomiseDashboard();
  id:any;
  addPanelLoading: boolean = false;
  saveLoading: boolean = false;
  deleteConfrim: boolean = false;
  editingName: boolean = false;
  deleteid: number;
  newId: number;
  saving: boolean = false;
  nameUpdate: boolean = false;
  widgetid: number;
  tableData: any;
  tableArray = [];
  tabLoading: boolean = false;
  searchScope: SearchScope = new SearchScope(10, 'Query');
  page: number = 0;
  totalCount: number;
  error: string;
  grid = {
    cellHeight: '16.8vh',//14.9vh
    verticalMargin: 5,
    animate: true,
    autoFit: true,   // just fit based on tallest content.
    autoFitByOverflow: true,    // if you want it to also accommodate the one that overflows the most. Requires previous option.
    alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    resizable: {
      handles: 'se, s, sw, w'
    }
  }
  dateTime;
  date = new Date();
  savingByAccount: boolean = false;
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
  currentJob: any;
  popup: boolean = false;
  filterVal = [];
  pageSizeIndex = [];
  tabLoadIndex = [];
  panelNameIndex = [];
  tableDataIndex = [];
  tableArrayIndex = [];
  queryTextIndex = [];
  queryTextForPage = [];
  categoryData:any=[];
  candleStickData:any=[];
  //Component Height
  component_height: number;
  //Query and Index
  sessionQuery: any;
  sessionIndex: any;
  barCount: number;
  donutCount: number;
  funnelCount: number;
  pieCount: number;
  loadMoreData: boolean = true;
  totalLoadMoreCount = [];
  fieldValueCount = [];
  filterapply: boolean = false;
  filterVal2 = [];
  applyFiltered = [];
  screenName: string = '';
  isLoading = [];
  darkBkcolor: string = '';
  lightBkcolor: string = '';
  cardleft: string = '';
  cardright: string = '';
  cardtop: string = '';
  cardbottom: string = '';
  cardcolor: string = '';
  cardtxt: string = '';
  backgroundColor: string = '';
  fontColor: string = '';
  getUserName: string = '';
  option: any[] = [];
  index: any;
  tabLoadingIndex = [];
  homeId:any;
  @HostListener('window:resize', ['$event'])
  updateComponentSize() {
    this.component_height = window.innerHeight;
  }
  constructor(
    private colorService: ColorService,
    public dialog: MatDialog,
    public jwtAuthenicationService: JwtAuthenticationService,
    private url: UrlService,
    public router: Router,
    private location: Location,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar,
    public customService: CustomServiceService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.updateComponentSize();
    this.getUserName = sessionStorage.getItem('authenticatedUser')
    this.customLayout = JSON.parse(sessionStorage.getItem('grid-layout1'));
     if (this.customLayout) {
       this.customLayout.widget.map((element, index) => {
         element.actualData = JSON.parse(element.data);
       });
     }
      else if(!this.customLayout){
       this.homeMapping();
      }
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    this.backgroundColor = localStorage.getItem('backgroundColor');
    this.fontColor = localStorage.getItem('fontColor');
    if(this.customLayout.id != null && this.customLayout.id !== undefined){
      this.darkBkcolor=this.colorService.getthColor(this.customLayout.id.toString());
      this.lightBkcolor=this.colorService.gettbColor(this.customLayout.id.toString());
      this.cardleft=this.colorService.getcardlColor(this.customLayout.id.toString());
      this.cardright=this.colorService.getcardlColor(this.customLayout.id.toString());
      this.cardtop=this.colorService.getcardlColor(this.customLayout.id.toString());
      this.cardbottom=this.colorService.getcardlColor(this.customLayout.id.toString());
      this.cardcolor=this.colorService.getcardColor(this.customLayout.id.toString());
      this.cardtxt=this.colorService.getcardTxt(this.customLayout.id.toString());
      }
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    if (!this.customLayout) {
      this.homeMapping();
    }
    GridStack.init(this.grid);
    this.homeId=sessionStorage.getItem('homeId');
    if(this.customLayout?.id!==null && this.customLayout?.id!==undefined){
      this.sessionQuery=sessionStorage.getItem('queryText')
      this.sessionIndex=sessionStorage.getItem('indexOfWidget')
      sessionStorage.setItem('tempId',this.customLayout.id.toString())
    // const filterSet=sessionStorage.getItem('filterSet')
    for (let i = 0; i < (this.customLayout?.widget?.length ?? 0); i++) {
      let num = this.data.id;
      let text;
      // Test if 'ID =' followed by any digits is present in queryText
      const regex = /(\b\w+\.)?ID\s*=\s*(\d+)/;

      const match = this.customLayout.widget[i].queryText.match(regex);
    
      if (match) {
        const tableName = match[1] || ''; // Table name (if present), empty string otherwise
        const existingID = match[2]; // Existing ID
    
    
        // Replace 'anyTableName.ID =' followed by any digits with 'anyTableName.ID = ${num}'
        this.customLayout.widget[i].queryText = this.customLayout.widget[i].queryText.replace(regex, `${tableName}ID = ${num}`);
      }
      text=this.customLayout.widget[i].queryText
  
      // Call showQueryData after processing all conditions for the current widget
      this.showQueryData(text, i);
  }
  
  
  
    }
  }
  public ngAfterViewInit() {
    GridStack.init(this.grid);
    // grid.on("resizestop", function(event, item: GridItemHTMLElement){
    //   sessionStorage.setItem("grid-layout", '[{x: 0, y: 0, w: 2, h: 6, id: "0"}]')
    // })
  }
  homeMapping() {
    this.customService.homeMapping().subscribe(res => {
      if (this.customLayout == null) {
        this.customLayout = res;
        sessionStorage.setItem('homeId', this.customLayout?.id?.toString())
        if (this.customLayout?.userName != undefined) {
          // window.location.reload();
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/application-entry']);
        }
      }
      this.customLayout?.widget.map((element, index) => {
        element.actualData = JSON.parse(element.data);
        this.previewOptions(index);
        sessionStorage.setItem('grid-layout', JSON.stringify(this.customLayout));
        let obj = sessionStorage.setItem('tempId',this.customLayout.id.toString())
        // console.log(obj)
      });
      // window.location.reload();
    })
  }
  //Open dialog to edit
  addWidgets(layout: GridStackElement, index: number) {
    const dialogRef = this.dialog.open(WidgetsComponent, {
      width: '1200px',
      height: '620px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: { panelName: layout.panelName, widget: null }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if (result != null) {
          this.customLayout.widget[index] = result.widget;
          this.customLayout.widget[index].data = JSON.stringify(this.customLayout.widget[index].actualData);
          this.customLayout.layout[index].panelName = result.panelName;
          this.previewOptions(index);
        }
      }
    )
  }
  getDefaultDasboard() {
    this.customService.getDefaultDashboard().subscribe(res => {
      let layout = res;
      layout.widget.map((element) => {
        element.actualData = JSON.parse(element.data);
      });
    }, err => {
      if (err.error) {
        // this.customLayout.defaultDashboard = true
        this.customLayout.dynamicDashboardUsers = ['all']
      }
    }
    )
  }

  //Open Settings
  openSettings(layout: GridStackElement, index: number) {
    this.customLayout.widget[index].actualData = JSON.parse(this.customLayout.widget[index].data);
    console.log(this.customLayout.widget[index]);
    const dialogRef = this.dialog.open(WidgetsSettingsComponent, {
      width: '1200px',
      height: '620px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: { panelName: layout.panelName, widget: this.customLayout.widget[index] },
    });
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if (result != null) {
          // if (this.customLayout.userName != this.jwtAuthenicationService.getAuthenticatedUser()) {
          //   this.customLayout.widget[index].id = null;
          //   this.customLayout.widget[index].query['id'] = null;
          //   this.customLayout.layout[index].primaryId = null;
          // }
          this.customLayout.widget[index] = result.widget;
          this.customLayout.widget[index].data = JSON.stringify(result.widget.actualData);
          this.customLayout.layout[index].panelName = result.panelName;
          if (this.customLayout.widget[index].type == 'table') {
            this.tableArray = [];
            this.tableData = this.customLayout.widget[index]?.actualData?.data;
            this.tableDataIndex[index] = this.tableData;
            this.tableArrayIndex[index] = this.tableArray;
            this.totalCount = this.customLayout.widget[index]?.actualData?.count;
            Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
            this.paginator.pageIndex = 0;
            this.queryText = this.customLayout?.widget[index]?.queryText;
            this.queryTextForPage[index] = this.queryText;
            this.showQueryData(this.queryTextForPage[index], index);
          }
          else {
            this.previewOptions(index);
          }
        }
      }
    )
  }

  //Open apply filter
  applyFilter(layout: GridStackElement, index: number) {
    const dialogRef = this.dialog.open(TableQueryFilterComponent, {
      width: '1800px',
      height: '555px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: { panelName: layout.panelName, widget: this.customLayout.widget[index] }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result != null) {
          this.filterapply = true;
          this.applyFiltered[index] = this.filterapply
          this.filterVal[index] = result[2].where;
          this.filterVal2[index] = result[2].where2;
          this.customLayout.widget[index].actualData = result[0];
          this.queryText = result[1];
          this.queryTextForPage[index] = this.queryText;
          for (let i = 0; i < this.filterVal[index]?.length; i++) {
            if (this.filterVal[index][i]?.operandField === '') {
              this.filterapply = false;
              this.applyFiltered[index] = false
            }
          }
          if (this.customLayout.widget[index].type == 'table') {
            this.tableArray = [];
            this.tableData = this.customLayout.widget[index]?.actualData?.data;
            this.tableDataIndex[index] = this.tableData;
            this.tableArrayIndex[index] = this.tableArray;
            this.totalCount = this.customLayout.widget[index]?.actualData?.count;
            Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
            this.paginator.pageIndex = 0;
            this.showQueryData(this.queryTextForPage[index], index);
          }
          else {
            this.previewOptions(index);
          }
        }
      }
    )
  }

  //Open dialog to edit
  addExistingWidgets(index: number) {
    const dialogRef = this.dialog.open(WidgetsScreenComponent, {
      width: '1120px',
      height: '800px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if (result != null) {
          // if(this.customLayout.userName != this.jwtAuthenicationService.getAuthenticatedUser()){
          //   this.customLayout.widget[index].id = null;
          //   this.customLayout.widget[index].query['id']= null;
          //   this.customLayout.layout[index].primaryId = null;
          // }
          this.customLayout.widget[index] = result.widget;
          this.customLayout.widget[index].data = JSON.stringify(this.customLayout.widget[index].actualData);
          this.tableData = this.customLayout.widget[index]?.actualData.data;
          this.queryText = this.customLayout.widget[index]?.queryText;
          this.totalCount = this.customLayout.widget[index]?.actualData.count
          this.previewOptions(index);
        }
      }
    )
  }
  goBack() {
    this.location.back();
  }
  getPageNumbers(i: number): number[] {
    const totalCount = this.totalCountIndex[i];
    const pageSize = this.pageSizeIndex[i];

    const totalPages = Math.ceil(totalCount / pageSize);
    return Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5);
  }

  nextPage(i: number): void {
    const totalCount = this.totalCountIndex[i];
    const pageSize = this.pageSizeIndex[i];

    const totalPages = Math.ceil(totalCount / pageSize);
    if (this.loadMoreGraphs < totalPages) {
      this.page++;
    }
  }
  isLastPage(i: number): boolean {
    const totalCount = this.totalCountIndex[i];
    const pageSize = this.pageSizeIndex[i];

    const totalPages = Math.ceil(totalCount / pageSize);
    return this.page + 1 === totalPages;
  }
  threeDim: boolean = false;
  currentPage: number = 1;

  //Open dialog to edit
  maximizeWidget(index: number) {
    this.customLayout.widget[index].actualData = JSON.parse(this.customLayout.widget[index].data);
    const dialogRef = this.dialog.open(ExistingWidgetComponent, {
      width: '88vw',
      height: '88vh',
      data: { widget: this.customLayout.widget[index], threeDim: this.threeDim[index], layoutID: this.customLayout.id },
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop: true,
    });
    this.router.events
      .subscribe(() => {
        dialogRef.close();
      });
    // console.log(this.customLayout.widget[index])
  }

  // Get All Template
  // getAllTemplate(){
  //   this.customService.getTemplate().subscribe(
  //     res =>{
  //       console.log(res);
  //     },err =>{
  //       this.openErrSnackbar(err);
  //     }
  //   )
  // }

  // Create New Template
  createNewTemplate() {
    this.saveLoading = true;
    this.customService.createTemplate(this.customLayout).subscribe(
      res => {
        console.log(res);
        this.assigningData(res);
        this.saveLoading = false;
        this.openSnackBar(res['status'], '');
        sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
        window.location.reload();
        // this.goBack();
      }, err => {
        this.saveLoading = false;
        this.openErrSnackbar(err);
      }
    )
  }

  //Update New Template
  updateNewTemplate() {
    this.customService.updateTemplate(this.customLayout.id, this.customLayout).subscribe(
      res => {
        console.log(res);
        this.assigningData(res);
        this.openSnackBar(res['status'], '');
        sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
        window.location.reload();
        // this.goBack();
      }, err => {
        this.openErrSnackbar(err);
      }
    )
  }

  assigningData(res) {
    this.customLayout = res["data"];
    this.customLayout.widget.map((item) => {
      item.actualData = JSON.parse(item.data);
    });
  }

  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['success-snackbar'], duration: 5000,
      data: {
        message: message, icon: 'done', type: 'success'
      }
    });
  }

  openErrSnackbar(message) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['error-snackbar'], duration: 5000,
      data: {
        message: message, icon: 'error_outline', type: 'error'
      }
    });
  }

  // ADDING PANEL  
  async onAddRow() {
    this.addPanelLoading = true;
    this.newId = this.customLayout.layout.length;
    this.customLayout.layout.push(new GridStackElement(this.newId, '3', '2', '0', '0', `Panel ${this.newId + 1}`));
    if (this.customLayout.id) {
      await this.customService.updateTemplate(this.customLayout.id, this.customLayout).toPromise().then(
        res => {
          this.assigningData(res);
          this.addPanelLoading = false;
        },
        err => {
          this.addPanelLoading = false
        }
      );
    } else {
      await this.customService.createTemplate(this.customLayout).toPromise().then(
        res => {
          this.assigningData(res);
          this.addPanelLoading = false;
        },
        err => {
          this.addPanelLoading = false
        }
      );
    }
    sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
    window.location.reload();
  }

  //Dashboard Level Mapping
  dashboardMapping() {
    const dialogRef = this.dialog.open(TemplateMappingComponent, {
      width: '750px',
      height: '350px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: this.customLayout
    });
  }

  Saving() {
    if (this.customLayout.dashboardName == 'New Template' || this.customLayout.dashboardName == '') {
      this.nameUpdate = true;
    } else {
      // console.log(this.customLayout);
      if (this.customLayout.id) {
        this.updateNewTemplate();
      } else {
        this.createNewTemplate();
      }
    }
  }

  console(i) {
    this.widgetid = this.customLayout.widget[i].id;
    console.log(this.widgetid);
  }

  // Delete Panel
  deletePanel() {
    this.customLayout.layout.splice(this.customLayout.layout.map(x => {
      return x.id;
    }).indexOf(this.deleteid), 1);
    if (this.widgetid) {
      this.customLayout.widget.splice(this.customLayout.widget.map(x => {
        return x.id;
      }).indexOf(this.widgetid), 1);
    }
    this.deleteConfrim = false;
    sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
    window.location.reload();
  }
  queryText: any;
  totalCountIndex = [];
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
  previewOptions(index) {
    this.index = index;
    let theme = 'theme-light';
    let bg = 'theme-light';
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    this.darkBkcolor = this.colorService.getthColor(this.customLayout.id.toString());
    this.lightBkcolor = this.colorService.gettbColor(this.customLayout.id.toString());
    this.cardleft = this.colorService.getcardlColor(this.customLayout.id.toString());
    this.cardright = this.colorService.getcardrColor(this.customLayout.id.toString());
    this.cardtop = this.colorService.getcardtColor(this.customLayout.id.toString());
    this.cardbottom = this.colorService.getcardbColor(this.customLayout.id.toString());
    this.cardcolor = this.colorService.getcardColor(this.customLayout.id.toString());
    this.cardtxt = this.colorService.getcardTxt(this.customLayout.id.toString());
    switch (this.customLayout.widget[index].type) {
      case "table":
        this.tableArray= [];
        this.tableData = this.customLayout.widget[index]?.actualData.data;
        this.tableDataIndex[index] = this.tableData
        this.queryText=this.customLayout.widget[index]?.queryText;
        this.totalCount=this.customLayout.widget[index]?.actualData.count;  
        this.totalCountIndex[index]=this.totalCount;
        this.queryTextIndex[index]=this.queryText;
        this.queryTextForPage[index] = this.queryTextIndex[index];
        Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
        this.tableArrayIndex[index] = this.tableArray;
        break;
      case "lineChart":
        this.option[index] = {
          title: {
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color: this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.customLayout.widget[index].graphSettings.toolTipTrigger,
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
            show: this.customLayout.widget[index].graphSettings.toolboxShow,
            top: '10',
            right: '30',
            feature: {
              dataZoom: {
                show: this.customLayout.widget[index].graphSettings.toolboxZoom,
                yAxisIndex: 'none'
              },
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              magicType: { show: this.customLayout.widget[index].graphSettings.toolboxType, type: ['line', 'bar'] },
              restore: { show: this.customLayout.widget[index].graphSettings.toolboxType },
              saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave }
            }
          },
          legend: {
            show: this.customLayout.widget[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.customLayout.widget[index].graphSettings.legendAlign,
            orient: this.customLayout.widget[index].graphSettings.legendOrient,
            data: [this.customLayout.widget[index].graphSettings.legendName],
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
            },
          },
          xAxis: {
            type: this.customLayout.widget[index].graphSettings.xaxis,
            data: this.customLayout.widget[index].actualData.headers
          },
          yAxis: {
            type: this.customLayout.widget[index].graphSettings.yaxis,
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
            show: this.customLayout.widget[index].graphSettings.labelShow,
            position: this.customLayout.widget[index].graphSettings.labelPosition
          },
          labelLine: {
            show: this.customLayout.widget[index].graphSettings.labelLineShow
          },
          series: [{
            data: this.customLayout.widget[index].actualData.data,
            type: 'line',
            name: this.customLayout.widget[index].graphSettings.legendName,
            label: {
              textStyle: {
                color: '#777',
                textShadowColor: '#777',
                textShadowOffsetX: 1,
              },
            },
            showBackground: true,
          }]
        };
        break;
      case "pieChart":
        this.option[index] = {
          title: {
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color: this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.customLayout.widget[index].graphSettings.toolTipTrigger
          },
          legend: {
            show: this.customLayout.widget[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 10,
            left: this.customLayout.widget[index].graphSettings.legendAlign,
            orient: this.customLayout.widget[index].graphSettings.legendOrient,
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
            },
          },
          toolbox: {
            show: this.customLayout.widget[index].graphSettings.toolboxShow,
            top: '10',
            right: '30',
            feature: {
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave }
            }
          },
          series: [
            {
              name: 'Pie',
              type: 'pie',
              radius: this.customLayout.widget[index].graphSettings.radius,
              label: {
                show: this.customLayout.widget[index].graphSettings.labelShow,
                position: this.customLayout.widget[index].graphSettings.labelPosition,
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
                },
              },
              labelLine: {
                show: this.customLayout.widget[index].graphSettings.labelLineShow
              },
              data: this.customLayout.widget[index].actualData.data,
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
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            top: -4,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            },
            // label: {
            //   fontSize:'10',
            // },
            left: this.customLayout.widget[index].graphSettings.titleAlign
          },
          color: this.gettheme(this.customLayout.id),
          series: [{
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
                borderColor: this.gettheme(this.customLayout.id)[0]
              }
            },
            itemStyle: {
              color: this.gettheme(this.customLayout.id)[0]
            },
            detail: {
              valueAnimation: true,
              fontSize: 20,
              offsetCenter: [0, '100%']
            },
            title: {
              offsetCenter: [0, '83%'],
              fontSize: 12
            },
            data: [
              {
                // name: isNaN(this.customLayout.widget[index].actualData.value) ? '' : this.customLayout.widget[index].query.columnName1.toString(),
                value: isNaN(this.customLayout.widget[index].actualData.value) ? 'NaN' : this.customLayout.widget[index].actualData.value
              }
            ]
          }]
        };
        break;
      case "donutChart":
        this.option[index] = {
          title: {
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color: this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.customLayout.widget[index].graphSettings.toolTipTrigger
          },
          legend: {
            show: this.customLayout.widget[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.customLayout.widget[index].graphSettings.legendAlign,
            orient: this.customLayout.widget[index].graphSettings.legendOrient,
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
            },
          },
          toolbox: {
            show: this.customLayout.widget[index].graphSettings.toolboxShow,
            top: '10',
            right: '30',
            feature: {
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave }
            }
          },
          series: [
            {
              name: 'Pie',
              type: 'pie',
              radius: [this.customLayout.widget[index].graphSettings.innerRadius, this.customLayout.widget[index].graphSettings.outerRadius],
              avoidLabelOverlap: false,
              label: {
                show: this.customLayout.widget[index].graphSettings.labelShow,
                position: this.customLayout.widget[index].graphSettings.labelPosition,
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
                },
              },
              labelLine: {
                show: this.customLayout.widget[index].graphSettings.labelLineShow
              },
              data: this.customLayout.widget[index].actualData.data,
            }
          ]
        };
        break;
      case "funnelChart":
        this.option[index] = {
          title: {
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color: this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.customLayout.widget[index].graphSettings.toolTipTrigger
          },
          legend: {
            show: this.customLayout.widget[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.customLayout.widget[index].graphSettings.legendAlign,
            orient: this.customLayout.widget[index].graphSettings.legendOrient,
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
            },
          },
          toolbox: {
            show: this.customLayout.widget[index].graphSettings.toolboxShow,
            top: '10',
            right: '30',
            feature: {
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave }
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
                show: this.customLayout.widget[index].graphSettings.labelShow,
                position: this.customLayout.widget[index].graphSettings.labelPosition,
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
                },
              },
              labelLine: {
                show: this.customLayout.widget[index].graphSettings.labelLineShow,
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
              data: this.customLayout.widget[index].actualData.data
            }
          ]
        };
        break;
      case "barChart":
        this.option[index] = {
          title: {
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color: this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light' ? 'white' : 'black',
            trigger: this.customLayout.widget[index].graphSettings.toolTipTrigger,
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
            show: this.customLayout.widget[index].graphSettings.toolboxShow,
            top: '10',
            right: '30',
            feature: {
              dataZoom: {
                show: this.customLayout.widget[index].graphSettings.toolboxZoom,
                yAxisIndex: 'none'
              },
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              magicType: { show: this.customLayout.widget[index].graphSettings.toolboxType, type: ['line', 'bar'] },
              restore: { show: this.customLayout.widget[index].graphSettings.toolboxType, },
              saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave, }
            }
          },
          legend: {
            show: this.customLayout.widget[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.customLayout.widget[index].graphSettings.legendAlign,
            orient: this.customLayout.widget[index].graphSettings.legendOrient,
            data: [this.customLayout.widget[index].graphSettings.legendName],
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
            },
          },
          xAxis: {
            // name: this.customLayout.widget[index].query.columnName1,
            nameLocation: 'middle',
            nameTextStyle: {
              lineHeight: 40,
              fontWeight: '600'
            },
            type: this.customLayout.widget[index].graphSettings.xaxis,
            data: this.customLayout.widget[index].actualData.headers
          },
          yAxis: {
            // name: this.customLayout.widget[index].query.columnName2,
            nameLocation: 'middle',
            nameTextStyle: {
              lineHeight: 70,
              fontWeight: '600'
            },
            type: this.customLayout.widget[index].graphSettings.yaxis,
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
            show: this.customLayout.widget[index].graphSettings.labelShow,
            position: this.customLayout.widget[index].graphSettings.labelPosition
          },
          labelLine: {
            show: this.customLayout.widget[index].graphSettings.labelLineShow
          },
          series: [{
            data: this.customLayout.widget[index].actualData.data,
            type: 'bar',
            name: this.customLayout.widget[index].graphSettings.legendName,
            label: {
              textStyle: {
                color: '#777',
                textShadowColor: '#777',
                textShadowOffsetX: 1,
              }
            },
            showBackground: true,
            // itemStyle: {
            //   color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id): new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: '#83bff6' },
            //     { offset: 0.5, color: '#8fd9ce' },
            //     { offset: 1, color: 'rgb(7, 148, 173)' }
            //   ])
            // },
            // emphasis: {
            //   itemStyle: {
            //     color:  this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id):new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: 'rgb(7, 148, 173)' },
            //       { offset: 0.7, color: '#8fd9ce' },
            //       { offset: 1, color: '#83bff6' }
            //     ])
            //   }
            // }, 
          }]
        };
        break;
      case "multipleChart":
          let actualData;
           actualData = this.customLayout?.widget[index]?.actualData?.data;
          //  console.log(actualData)
          let xaxis,bar1,bar2,line;
           xaxis = actualData.map(item => item.name);
           bar1 = actualData.map(item => item.label);
           bar2 = actualData.map(item => item.value2);
           line = actualData.map(item => item.value);
          this.option[index] = {
             title: {
              show: this.customLayout.widget[index].graphSettings.titleShow,
              text: this.customLayout.widget[index].graphSettings.titleText,
              left: this.customLayout.widget[index].graphSettings.titleAlign,            
              textStyle: {
                color: this.gettextColor(this.customLayout.id)
            }
          },
          color: this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            trigger: this.customLayout.widget[index].graphSettings.toolTipTrigger,
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            right: '20%'
          },
          toolbox: {
            show: this.customLayout.widget[index].graphSettings.toolboxShow,
              top: '10',
              right:'30',
            feature: {
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            show: this.customLayout.widget[index].graphSettings.legendShow,
            type: 'scroll',
            bottom: 1,
            left: this.customLayout.widget[index].graphSettings.legendAlign,
            orient: this.customLayout.widget[index].graphSettings.legendOrient,
            data: [this.customLayout.widget[index].graphSettings.legendName,this.customLayout.widget[index].graphSettings.legendName2,this.customLayout.widget[index].graphSettings.legendName3],  
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
          },
          },
          label: {
            show: this.customLayout.widget[index].graphSettings.labelShow,
            position: this.customLayout.widget[index].graphSettings.labelPosition
          },
          labelLine: {
            show: this.customLayout.widget[index].graphSettings.labelLineShow
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
                  color: this.gettheme(this.customLayout.id) ? this.gettheme(this.customLayout.id)[0] : colors[0]
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
                  color: this.gettheme(this.customLayout.id) ? this.gettheme(this.customLayout.id)[1] : colors[1]
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
                  color: this.gettheme(this.customLayout.id) ? this.gettheme(this.customLayout.id)[2] : colors[2]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: this.customLayout.widget[index].graphSettings.legendName,
              type: 'bar',
              data: bar1,
              label: {
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
                }
              },
              color: this.gettheme(this.customLayout.id) ? this.gettheme(this.customLayout.id)[0] : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#8fd9ce' },
                { offset: 1, color: 'rgb(7, 148, 173)' }
              ])
            },
            {
              name:this.customLayout.widget[index].graphSettings.legendName2,
              type: 'bar',
              yAxisIndex: 1,
              data: bar2,
              label: {
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
                }
              },
              color: this.gettheme(this.customLayout.id) ? this.gettheme(this.customLayout.id)[1] : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#8fd9ce' },
                { offset: 1, color: 'rgb(7, 148, 173)' }
              ])
            },
            {
              name:this.customLayout.widget[index].graphSettings.legendName3,
              type: 'line',
              yAxisIndex: 1,
              data: line,
              label: {
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
                }
              },
              color: this.gettheme(this.customLayout.id) ? this.gettheme(this.customLayout.id)[2] : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#8fd9ce' },
                { offset: 1, color: 'rgb(7, 148, 173)' }
              ])
            },
          ]
        };
        break;
        case "candleStick": {
          let upColor = '#00da3c';
          let downColor = '#ec0000';
          let col;
          const actualData = this.customLayout.widget[index]?.actualData?.data;
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
          this.option[index] = {
            title: {
              show: this.customLayout.widget[index].graphSettings.titleShow,
              text: this.customLayout.widget[index].graphSettings.titleText,
              left: this.customLayout.widget[index].graphSettings.titleAlign,
              textStyle: {
                color: this.gettextColor(this.customLayout.id)
              }
            },
            animation: false,
            legend: {
              show: this.customLayout.widget[index].graphSettings.legendShow,
              type: 'scroll',
              bottom: 10,
              left: this.customLayout.widget[index].graphSettings.legendAlign,
              orient: this.customLayout.widget[index].graphSettings.legendOrient,
              data: [this.customLayout.widget[index].graphSettings.legendName],
              textStyle: {
                color: '#777',
                textShadowColor: '#777',
                textShadowOffsetX: 1,
            },
            },
            tooltip: {
              show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
              show: this.customLayout.widget[index].graphSettings.toolboxShow,
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
                height: '52%'
              },
              {
                left: '10%',
                right: '8%',
                top: '68%',
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
                top: '90%',
                start: 0,
                end: 100
              }
            ],
            series: [
              {
                name: this.customLayout.widget[index].graphSettings.legendName,
              type: 'candlestick',
              data: this.candleStickData,
              itemStyle: {
                color0: downColor,
                color: upColor,
                borderColor: undefined,
                borderColor0: undefined
              },
            },
          //    {
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
        break;
    }

  }

  showQueryData(queryText:any, i){
    if(this.customLayout?.widget[i]?.type=='card'){
      this.customLayout.widget[i].type='cardChart'
    }
    this.tabLoading = true;
    this.tabLoadIndex[i] = this.tabLoading
    this.isLoading[i]=true;
    // this.paginator.pageSize=this.searchScope.pageSize;
    this.pageSizeIndex[i] = this.searchScope.pageSize
    this.customService.getQueryData(this.customLayout?.widget[i].type, queryText,this.page+1 ,this.pageSizeIndex[i]).subscribe(
      res=>{
        this.tabLoading = false;
        this.isLoading[i]=false
        this.tabLoadIndex[i] = this.tabLoading
        // console.log(res)
          if(this.customLayout.widget[i].type=='table'){
            this.tableData = [];
            this.tableDataIndex[i] = [];
            this.totalCountIndex[i] = [];
            this.tableArrayIndex[i] = [];
            this.tableData = res['data'];
            this.totalCount = res['count'];
            this.tableDataIndex[i] = [];
            this.totalCountIndex[i] = [];
            this.tableArrayIndex[i] = [];
            this.tableDataIndex[i] = this.tableData;
            this.totalCountIndex[i] = this.totalCount;
            this.tableArray = [];
            Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
            this.tableArrayIndex[i] = this.tableArray;
          }
        if(this.customLayout?.widget[i]?.type=='cardChart'||this.customLayout?.widget[i].type=='card'){
          this.customLayout.widget[i].actualData.value=res['value'];
          this.previewOptions(i);
        }
        if(this.customLayout?.widget[i].type==='gaugeChart'){
          this.customLayout.widget[i].actualData.value=res['value']
          this.previewOptions(i)
        }
        if(this.customLayout.widget[i].type=='pieChart'||this.customLayout.widget[i].type=='donutChart'||this.customLayout.widget[i].type=='funnelChart'){
          this.customLayout.widget[i].actualData.data=res['data'];
          this.previewOptions(i);
        }
        if(this.customLayout.widget[i].type=='candleStick'){
          this.customLayout.widget[i].actualData.data=res['data'];
          this.previewOptions(i)
        }
        if(this.customLayout.widget[i].type=='barChart'||this.customLayout.widget[i].type=='lineChart'||this.customLayout.widget[i].type=='multipleChart'){
          this.customLayout.widget[i].actualData.data=res['data'];
          this.customLayout.widget[i].actualData.headers=res['headers']
          this.previewOptions(i)
        }
      },err =>{
        this.error = err.error;
        this.tabLoading = false;
        this.isLoading[i]=false;
        this.tabLoadIndex[i] = this.tabLoading
        if(err.error['error']!==null && err.error['error']!==undefined){
          this.openErrSnackbar(err.error['error'])
        }
      }
    )
  }
  loadMoreMultiple:number=1;

  clearFilter(i) {
    this.tabLoading = true;
    this.tabLoadIndex[i] = this.tabLoading
    this.isLoading[i] = true;
    this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
      res => {
        this.tabLoading = false;
        this.isLoading[i] = false;
        this.tabLoadIndex[i] = this.tabLoading
        if (this.customLayout?.widget[i].type === 'table') {
          this.tableArray = [];
          this.tabLoadIndex[i] = this.tabLoading
          this.tableData = res['data'];
          this.totalCount = res['count'];
          this.tableDataIndex[i] = this.tableData;
          this.totalCountIndex[i] = this.totalCount;
          this.tableArrayIndex[i] = this.tableArray;
          Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
          this.tableArrayIndex[i] = this.tableArray;
          console.log(this.tableDataIndex[i], this.tableArrayIndex[i])
        }
        if (this.customLayout?.widget[i]?.type == 'card' || this.customLayout?.widget[i]?.type == 'cardChart' || this.customLayout?.widget[i]?.type == 'gaugeChart') {
          this.customService.getQueryData(this.customLayout?.widget[i].type, this.customLayout?.widget[i].queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
            res => {
              this.isLoading[i] = false;
              this.customLayout.widget[i].actualData.value = res['value']
              // this.previewOptions(i)
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if (this.customLayout?.widget[i]?.type == 'barChart') {
          this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreGraphs, this.searchScopeOfGraph.pageSize).subscribe(
            res => {
              let headers: any[] = [];
              this.isLoading[i] = false;
              headers = res['headers'];
              headers?.forEach(e => {
                this.customLayout?.widget[i]?.actualData?.headers?.push(e)
              })
              let dataOfBar: any[] = [];
              dataOfBar = res['data'];
              this.barCount = res['count'];
              this.totalLoadMoreCount[i] = this.barCount
              dataOfBar?.forEach(e => {
                this.customLayout?.widget[i]?.actualData?.data?.push(e)
              })
              this.previewOptions(i);
              this.fieldValueCount[i] = dataOfBar;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if (this.customLayout?.widget[i]?.type == 'pieChart') {
          this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMorePie, this.searchScopeOfGraph.pageSize).subscribe(
            res => {
              let dataPie: any[] = [];
              this.isLoading[i] = false;
              dataPie = res['data'];
              this.pieCount = res['count']
              this.totalLoadMoreCount[i] = this.pieCount
              dataPie?.forEach(e => {
                this.customLayout.widget[i].actualData.data?.push(e)
              })
              if (dataPie?.length === this.pieCount) {
                this.loadMoreData = false;
              }
              this.previewOptions(i);
              this.fieldValueCount[i] = dataPie;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if (this.customLayout?.widget[i].type == 'funnelChart') {
          this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreFunnel, this.searchScopeOfGraph.pageSize).subscribe(
            res => {
              let data: any[] = [];
              this.isLoading[i] = false;
              data = res['data'];
              this.funnelCount = res['count']
              this.totalLoadMoreCount[i] = this.funnelCount
              data?.forEach(e => {
                this.customLayout.widget[i].actualData.data?.push(e)
              })
              this.previewOptions(i);
              this.fieldValueCount[i] = data;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if (this.customLayout?.widget[i].type == 'donutChart') {
          this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreDonut, this.searchScopeOfGraph.pageSize).subscribe(
            res => {
              let dataOfDonut: any[] = [];
              this.isLoading[i] = false;
              dataOfDonut = res['data'];
              this.donutCount = res['count']
              this.totalLoadMoreCount[i] = this.donutCount;
              dataOfDonut?.forEach(e => {
                this.customLayout.widget[i].actualData.data?.push(e)
              })
              this.previewOptions(i);
              this.fieldValueCount[i] = dataOfDonut;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if (this.customLayout?.widget[i].type == 'lineChart') {
          this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreLine, this.searchScopeOfGraph.pageSize).subscribe(
            res => {
              let headersOfLine: any[] = [];
              this.isLoading[i] = false;
              headersOfLine = res['headers'];
              headersOfLine?.forEach(e => {
                this.customLayout?.widget[i]?.actualData?.headers?.push(e)
              })
              let dataOfLine: any[] = [];
              dataOfLine = res['data']
              dataOfLine?.forEach(e => {
                this.customLayout.widget[i].actualData.data?.push(e)
                this.previewOptions(i)
              })
              this.fieldValueCount[i] = dataOfLine;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if(this.customLayout.widget[i].type=='candleStick'){
          this.customService.getQueryData(this.customLayout?.widget[i]?.type,this.customLayout.widget[i].queryText,this.loadMoreGraphs,this.searchScopeOfGraph.pageSize).subscribe(
            res=>{
              let data:any[]=[];
                data=res['data'];
                this.funnelCount=res['count']
                this.totalLoadMoreCount[i]=this.funnelCount
                data?.forEach(e=>{
                  this.customLayout.widget[i].actualData.data?.push(e)
                })
                this.previewOptions(i);
                this.fieldValueCount[i]=this.funnelCount;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
        }
        if(this.customLayout?.widget[i]?.type=='multipleChart'){
          this.customService.getQueryData(this.customLayout?.widget[i]?.type,this.customLayout.widget[i].queryText,this.loadMoreMultiple,this.searchScopeOfGraph.pageSize).subscribe(
            res=>{
              this.isLoading[i]=false;
               let data:any[]=[];
              data=res['data'];
              this.funnelCount=res['count']
              this.totalLoadMoreCount[i]=this.funnelCount
              if(this.loadPrevPage==true){
                this.customLayout?.widget[i]?.actualData?.data?.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
              }else{
                data?.forEach(e=>{
                  this.customLayout.widget[i].actualData.data?.push(e)
                })
              }
              this.previewOptions(i)
              this.fieldValueCount[i]=data?.length;
            },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
          )
      }
      }, 
      err => {
        this.error = err.error;
        this.tabLoading = false;
        this.isLoading[i] = false;
        this.tabLoadIndex[i] = this.tabLoading
      }
    )
  }


  onPaginateChangeOfQuery(event, i: any) {
    this.searchScope.pageSize = event.pageSize;
    this.pageSizeIndex[i] = this.searchScope.pageSize
    this.page = event.pageIndex;
    this.showQueryData(this.queryTextForPage[i], i);
  }

  //Common Download method
  downloadAsFile(res, export_fileName, format: string, index) {
    let data = [res];
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyyMMdd_hhmmss');
    let type = ''
    var types;
    if (this.customLayout.widget[index].type === 'table') {
      types = this.customLayout.widget[index].graphSettings.tableName
    }
    else if (this.customLayout.widget[index].type === 'cardChart') {
      types = this.customLayout.widget[index].graphSettings.labelName
    }
    else {
      types = this.customLayout.widget[index].graphSettings.titleText
    }
    if (export_fileName == types && format == 'xlsx') {
      type = 'application/zip'
    }
    else if (export_fileName == types && format == 'xls') {
      type = 'application/zip'
    }
    else if (export_fileName == types && format == 'csv') {
      type = 'application/zip'
    }
    var blob = new Blob(data, { type: type + format });
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if (export_fileName == types && format == 'xlsx') {
      anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
    }
    if (export_fileName == types && format == 'csv') {
      anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
    }
    anchor.href = url;
    anchor.click();
  }

  opensnackBar(message, action) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['success-snackbar'], duration: 5000,
      data: {
        message: message, icon: 'done', type: 'success', action: action
      }
    });
  }


  widget: Widgets = new Widgets();

  downloadLayout(exportType, index: number) {
    this.savingByAccount = true;
    this.openSnackBar('Your Download has Started', null)
    let query;
    if (this.filterapply == true) {
      query = this.queryTextForPage[index]
    }
    else {
      query = this.customLayout.widget[index].queryText
    }
    var type;
    if (this.customLayout.widget[index].type === 'table') {
      type = this.customLayout.widget[index].graphSettings.tableName
    }
    else if (this.customLayout.widget[index].type === 'card' || this.customLayout.widget[index].type === 'cardChart') {
      type = this.customLayout.widget[index].graphSettings.labelName
    }
    else {
      type = this.customLayout.widget[index].graphSettings.titleText
    }
    this.downloadStatusSubscription = this.customService.getExportOfLayout(query, exportType, this.customLayout.id, type).subscribe(
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
                  this.downloadAsFile(res, type, exportType, index);
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
  cancelExport() {
    this.popup = false;
    this.savingByAccount = false;
    this.downloadStatusSubscription.unsubscribe();
  }
  deleteExport(id) {
    this.customService.getDeleteExport(id).subscribe(
      res => {
        this.openSnackBar(res['status'], null)
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
  loadPrevPage: boolean = false;
  loadMoreCandle:number=1;
  loadMoreGraph(i) {
    this.tabLoading = true;
    this.pageSizeIndexOfGraph[i] = this.searchScopeOfGraph.pageSize
    this.isLoading[i] = this.tabLoading;

    if (this.loadMore == true && this.customLayout?.widget[i]?.type == 'barChart') {
      this.loadMoreGraphs = this.loadMoreGraphs + 1;
    }
    if (this.loadMore == true && this.customLayout?.widget[i]?.type == 'pieChart') {
      this.loadMorePie = this.loadMorePie + 1;
    }
    if (this.loadMore == true && this.customLayout?.widget[i]?.type == 'funnelChart') {
      this.loadMoreFunnel = this.loadMoreFunnel + 1;
    }
    if (this.loadMore == true && this.customLayout?.widget[i]?.type == 'donutChart') {
      this.loadMoreDonut = this.loadMoreDonut + 1;
    }
    if (this.loadMore == true && this.customLayout?.widget[i].type == 'lineChart') {
      this.loadMoreLine = this.loadMoreLine + 1;
    }
    if(this.loadMore==true && this.customLayout?.widget[i].type=='candleStick'){
      this.loadMoreCandle=this.loadMoreCandle+1;
    }
    if(this.loadMore==true && this.customLayout?.widget[i].type=='multipleChart'){
      this.loadMoreMultiple=this.loadMoreMultiple+1;
    }
    if (this.customLayout?.widget[i]?.type == 'barChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreGraphs = this.loadMoreGraphs - 2;
      }
      this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreGraphs + 1, this.pageSizeIndexOfGraph[i]).subscribe(
        res => {
          this.isLoading[i] = false;
          let headers: any[] = [];
          headers = res['headers'];
          let dataOfBar: any[] = [];
          dataOfBar = res['data'];
          this.barCount = res['count'];
          this.totalLoadMoreCount[i] = this.barCount
          if (this.loadPrevPage == true) {
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10, this.customLayout?.widget[i]?.actualData?.data?.length)
            this.customLayout?.widget[i]?.actualData?.headers?.splice(-10, this.customLayout?.widget[i]?.actualData?.headers?.length)
          } else {
            dataOfBar?.forEach(e => {
              this.customLayout.widget[i].actualData.data?.push(e)
            })
            headers?.forEach(e => {
              this.customLayout?.widget[i]?.actualData?.headers?.push(e)
            })
          }
          this.previewOptions(i)
          this.loadPrevPage = false;
          this.fieldValueCount[i] = dataOfBar?.length;
        },err=>{
          this.isLoading[i]=false;
          console.log(err.error)
        }
      )
    }
    if (this.customLayout?.widget[i]?.type == 'pieChart') {
      if (this.loadPrevPage == true) {
        this.loadMorePie = this.loadMorePie - 2;
      }
      this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMorePie + 1, this.pageSizeIndexOfGraph[i]).subscribe(
        res => {
          this.isLoading[i] = false;
          let dataPie: any[] = [];
          dataPie = res['data'];
          this.pieCount = res['count']
          this.totalLoadMoreCount[i] = this.pieCount
          if (this.loadPrevPage == true) {
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10, this.customLayout?.widget[i]?.actualData?.data?.length)
          } else {
            dataPie?.forEach(e => {
              this.customLayout.widget[i].actualData.data?.push(e)
            })
          }
          this.previewOptions(i);
          this.loadPrevPage = false;
          this.fieldValueCount[i] = dataPie?.length;
        },err=>{
          this.isLoading[i]=false;
          console.log(err.error)
        }
      )
    }
    if (this.customLayout?.widget[i].type == 'funnelChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreFunnel = this.loadMoreFunnel - 2;
      }
      this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreFunnel + 1, this.pageSizeIndexOfGraph[i]).subscribe(
        res => {
          this.isLoading[i] = false;
          let data: any[] = [];
          data = res['data'];
          this.funnelCount = res['count']
          this.totalLoadMoreCount[i] = this.funnelCount
          if (this.loadPrevPage == true) {
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10, this.customLayout?.widget[i]?.actualData?.data?.length)
          } else {
            data?.forEach(e => {
              this.customLayout.widget[i].actualData.data?.push(e)
            })
          }
          this.previewOptions(i);
          this.loadPrevPage = false;
          this.fieldValueCount[i] = data?.length;
        },err=>{
          this.isLoading[i]=false;
          console.log(err.error)
        }
      )
    }
    if (this.customLayout?.widget[i].type == 'donutChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreDonut = this.loadMoreDonut - 2;
      }
      this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreDonut + 1, this.pageSizeIndexOfGraph[i]).subscribe(
        res => {
          this.isLoading[i] = false;
          let dataOfDonut: any[] = [];
          dataOfDonut = res['data'];
          this.donutCount = res['count']
          this.totalLoadMoreCount[i] = this.donutCount;
          if (this.loadPrevPage == true) {
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10, this.customLayout?.widget[i]?.actualData?.data?.length)
          } else {
            dataOfDonut?.forEach(e => {
              this.customLayout.widget[i].actualData.data?.push(e)
            })
          }
          this.previewOptions(i);
          this.loadPrevPage = false;
          this.fieldValueCount[i] = dataOfDonut?.length;
        },err=>{
          this.isLoading[i]=false;
          console.log(err.error)
        }

      )
    }
    if (this.customLayout?.widget[i].type == 'lineChart') {
      if (this.loadPrevPage == true) {
        this.loadMoreLine = this.loadMoreLine - 2;
      }
      this.customService.getQueryData(this.customLayout.widget[i].type, this.customLayout.widget[i].queryText, this.loadMoreLine + 1, this.pageSizeIndexOfGraph[i]).subscribe(
        res => {
          this.isLoading[i] = false;
          let headersOfLine: any[] = [];
          headersOfLine = res['headers'];
          let dataOfLine: any[] = [];
          dataOfLine = res['data']
          if (this.loadPrevPage == true) {
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10, this.customLayout?.widget[i]?.actualData?.data?.length)
            this.customLayout?.widget[i]?.actualData?.headers?.splice(-10, this.customLayout?.widget[i]?.actualData?.headers?.length)
          } else {
            dataOfLine?.forEach(e => {
              this.customLayout.widget[i].actualData.data?.push(e)
              this.customLayout?.widget[i]?.actualData?.headers?.push(e)
            })
          }
          this.previewOptions(i)
          this.loadPrevPage = false;
          this.fieldValueCount[i] = dataOfLine?.length;
        },err=>{
          this.isLoading[i]=false;
          console.log(err.error)
        }
      )
    }
    if(this.customLayout?.widget[i]?.type=='candleStick'){
      if(this.loadPrevPage==true){
        this.loadMoreCandle=this.loadMoreCandle-2;
      }
        this.customService.getQueryData(this.customLayout?.widget[i]?.type,this.customLayout.widget[i].queryText,this.loadMoreCandle+1,this.pageSizeIndexOfGraph[i]).subscribe(
          res=>{
            this.isLoading[i]=false;
            let data:any[]=[];
            data=res['data'];
            this.funnelCount=res['count']
            this.totalLoadMoreCount[i]=this.funnelCount
            if(this.loadPrevPage==true){
              this.customLayout?.widget[i]?.actualData?.data.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
            }else{
              data?.forEach(e=>{
                this.customLayout.widget[i].actualData?.data?.push(e)
              })
            }
            this.previewOptions(i)
            this.loadPrevPage=false;
            this.fieldValueCount[i]=data?.length;
          },err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
        )
    }
    if(this.customLayout?.widget[i]?.type=='multipleChart'){
      if(this.loadPrevPage==true){
        this.loadMoreMultiple=this.loadMoreMultiple-2;
      }
        this.customService.getQueryData(this.customLayout?.widget[i]?.type,this.customLayout.widget[i].queryText,this.loadMoreMultiple+1,this.pageSizeIndexOfGraph[i]).subscribe(
          res=>{
            this.isLoading[i]=false;
          let data:any[]=[];
            data=res['data'];
            this.funnelCount=res['count']
            this.totalLoadMoreCount[i]=this.funnelCount
            if(this.loadPrevPage==true){
              this.customLayout?.widget[i]?.actualData?.data?.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
            }else{
              data?.forEach(e=>{
                this.customLayout.widget[i].actualData.data?.push(e)
              })
            }
            this.previewOptions(i)
            this.loadPrevPage=false;
            this.fieldValueCount[i]=data?.length;
          },err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
        )
    }
  }
  ngOnDestroy(): void {
    if (this.currentJob?.id !== null && this.currentJob?.id !== undefined && this.savingByAccount == true) {
      this.deleteExport(this.currentJob?.id);
      this.cancelExport();
    }
  }
  hoverStates: boolean[] = Array(this.customLayout.widget?.length).fill(false);
  setHoverState(index: number, state: boolean) {
    this.hoverStates[index] = state;
  }
  menuOpen: boolean = false;
  menuOpening() {
    this.menuOpen = this.menuOpen === true ? false : true;
  }
  getuserColor(id) {
    return this.colorService.getBckColor(id);
  }
  gettextColor(id) {
    return this.colorService.getTextColor(id);
  }
  gettheme(id) {
    return this.colorService.getColorArray(id);
  }
  getUserColor(id) {
    return this.colorService.getUserColor(id);
  }
}
