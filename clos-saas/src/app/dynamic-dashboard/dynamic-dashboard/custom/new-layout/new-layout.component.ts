import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  GridStack } from 'gridstack';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';
import { AUTHENTICATED_USER, JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { CustomServiceService } from '../../service/custom-service.service';
import { WidgetsComponent } from '../../widgets/widgets.component';
// import 'gridstack/dist/h5/gridstack-dd-native';
import { WidgetsScreenComponent } from '../../widgets/widgets-screen/widgets-screen.component';
import { CustomiseDashboard, GridStackElement, QueryFieldCustomDashBoard, SearchScope, Widgets } from '../../models/model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { Router } from '@angular/router';
import { WidgetsSettingsComponent } from '../../widgets/widgets-settings/widgets-settings.component';
import { TemplateMappingComponent } from '../../custom-mapping/template-mapping/template-mapping.component';
import { ExistingWidgetComponent } from '../../widgets/existing-widget/existing-widget.component';
import { DatePipe, Location } from '@angular/common';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { TableQueryFilterComponent } from '../../widgets/table-query-filter/table-query-filter.component';
import { MatPaginator } from '@angular/material/paginator';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import * as echarts from 'echarts';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import Highcharts3D from 'highcharts/highcharts-3d'; // Import the 3D module
import * as Highcharts from 'highcharts';
import funnel from 'highcharts/modules/funnel';
import funnel3d from 'highcharts/modules/funnel3d';
import funnelchart from 'highcharts/modules/cylinder';
import timeline from 'highcharts/modules/timeline';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { ColorService } from '../../color-service';
import { ThemeService } from 'src/app/dynamic-dashboard/theme-service';
import HighchartsGantt from 'highcharts/modules/gantt';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
timeline(Highcharts)
Highcharts3D(Highcharts)
funnel3d(Highcharts);
funnelchart(Highcharts)
funnel(Highcharts)
timeline(Highcharts)
HighchartsGantt(Highcharts);
@Component({
  selector: 'app-new-layout',
  templateUrl: './new-layout.component.html',
  styleUrls: ['./new-layout.component.scss']
})
export class NewLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('drawer2') drawer2: MatDrawer; // Reference to the second drawer
  customLayout = new CustomiseDashboard();
  addPanelLoading: boolean = false;
  saveLoading: boolean = false;
  deleteConfrim:boolean = false;
  editingName: boolean = false;
  deleteid : number;
  newId : number;
  saving: boolean = false;
  nameUpdate: boolean = false;
  widgetChooser: boolean = false;
  widgetid: number;
  tableData = [];
  tableArray = [];
  tableDataIndex = [];
  tableArrayIndex = [];
  tabLoading: boolean = false;
  searchScope:SearchScope=new SearchScope(10,'Query');
  page:number=0;
  totalCount:any;
  totalCountIndex=[];
  error:string;
  grid = {
    cellHeight: '16.8vh',
    animate: true,
    verticalMargin: 5,
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
  popup: boolean = false
  ability:any;
  accessMsg:any;
  editAbility:any;
  downloadAbility:boolean=false;
  editing:boolean=false;
  deleting:boolean=false;
  deleteAbility:any;
  //Component Height
component_height: number;
  createdDate=new Date();
  filterVal = [];
  pageSizeIndex = [];
  tabLoadIndex = [];
  panelNameIndex = [];
  filterVal2=[];
  sessionQuery:any='';
  sessionIndex:any;
  applyFiltered=[];
  userData: any;
  userRole: string;
  highcharts = Highcharts;
  optionsthreeDim:any[]=[];
  currentUser:any='';
  @Output() onPageChange: EventEmitter<PageData> = new EventEmitter<PageData>();
  @Input() pageData: PageData;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - app_header_height;
  }
  // @ViewChild("panelName", { static: false }) panelName;
mobileQuery: MediaQueryList;
  option: any[] = [];
private _mobileQueryListener: () => void;
  constructor(
    private colorService: ColorService,
    public jwtAuthenicationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private url: UrlService,
    media: MediaMatcher,
private snackBar: MatSnackBar,
    // public crmService: CrmServiceService,
public changeDetectorRef: ChangeDetectorRef,
    public customService: CustomServiceService,
    // public adminDataService: ServiceService,
    private location: Location,
    public router : Router,
    public datepipe:DatePipe,
    public renderer:Renderer2,
    private themeService:ThemeService,
    public encryptDecryptService:EncryptDecryptService
  ) {
    this.updateComponentSize();
this.mobileQuery = media.matchMedia('(max-width: 600px)');
this._mobileQueryListener = () => changeDetectorRef.detectChanges();
this.mobileQuery.addListener(this._mobileQueryListener);
    this.customLayout = JSON.parse(sessionStorage.getItem("gridlayout"));
    if(!this.customLayout.id){
      this.customLayout.dynamicDashboardUsers = [];
      // this.customLayout.secondaryUsers = [];
      this.customLayout.widget = [];
      // this.customLayout.defaultDashboard = false;
      this.customLayout.dashboardName = "New Template";
      let user=sessionStorage.getItem(AUTHENTICATED_USER)
      this.customLayout.userName=encryptDecryptService.decryptData(user);
    }else{
      let user=sessionStorage.getItem(AUTHENTICATED_USER)
      this.currentUser=encryptDecryptService.decryptData(user);
      this.customLayout.widget.forEach((item,index)=>{
        this.previewOptions(index);
      })
    }
  }
  fetchTheme() {
    // Fetch theme data and store it in the service
    fetch(`assets/${this.selectedTheme}-theme.json`)
      .then(response => response.json())
      .then(themeObject => {
        this.themeService.setThemeData(themeObject);
      })
      .catch(error => {
        console.error('Error fetching theme: ', error);
      });
  }

  public updateUrl(): Promise<any> {
    return this.url.getUrl().toPromise().then();
  }
  lengthId:any;
  updateId:any;
  getUserName:any;
  userColor:string;
  async ngOnInit() {
    // console.log(this.colorService.getthColor(this.customLayout.id.toString()))
    if(this.customLayout.id !== undefined){
    this.backgroundColor=this.colorService.getBckColor(this.customLayout.id.toString());
    this.textColor=this.colorService.getTextColor(this.customLayout.id.toString())
    this.darkBkcolor=this.colorService.getthColor(this.customLayout.id.toString());
    this.lightBkcolor=this.colorService.gettbColor(this.customLayout.id.toString());
    this.cardleft= this.colorService.getcardlColor(this.customLayout.id.toString());
    this.cardright= this.colorService.getcardrColor(this.customLayout.id.toString());
    this.cardtop= this.colorService.getcardtColor(this.customLayout.id.toString());
    this.cardbottom= this.colorService.getcardbColor(this.customLayout.id.toString());
    this.cardcolor= this.colorService.getcardColor(this.customLayout.id.toString());
    this.cardtxt= this.colorService.getcardTxt(this.customLayout.id.toString());
    }
    this.headerBckcolor = localStorage.getItem('backgroundColor');
    this.headerFontcolor = localStorage.getItem('fontColor');
    // localStorage.removeItem('colorArraymaximize');
    localStorage.removeItem('selectedTheme');
    localStorage.removeItem('typeOfChart');
    this.colorService.userColor$.subscribe(() => {
      // This will be triggered whenever the user color changes
      // You can update the UI as needed.
    });
   
    let response = await this.updateUrl();
    UrlService.API_URL = response?.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    GridStack.init(this.grid);
    this.getUserName=sessionStorage.getItem('authenticatedUser')
    if(this.customLayout?.id!==null && this.customLayout?.id!==undefined){
    this.sessionQuery=sessionStorage.getItem('queryText')
    this.sessionIndex=sessionStorage.getItem('indexOfWidget')
    for(let i=0;i<this.customLayout?.widget?.length;i++){
    this.showQueryData(this.customLayout?.widget[i].queryText,i)
    }
    this.backgroundColor=this.colorService.getBckColor(this.customLayout.id.toString());
    this.textColor=this.colorService.getTextColor(this.customLayout.id.toString())
    this.darkBkcolor=this.colorService.getthColor(this.customLayout.id.toString());
    this.lightBkcolor=this.colorService.gettbColor(this.customLayout.id.toString());
    this.headerBckcolor = localStorage.getItem('backgroundColor');
    this.headerFontcolor = localStorage.getItem('fontColor');
    // localStorage.removeItem('colorArraymaximize');
    localStorage.removeItem('selectedTheme');
    localStorage.removeItem('typeOfChart');
    this.colorService.userColor$.subscribe(() => {
      // This will be triggered whenever the user color changes
      // You can update the UI as needed.
    });
  }
    this.lengthId=sessionStorage.getItem('id')
    this.updateId=sessionStorage.getItem('update')
  }
  threeDim=[];
  userName:any='';
 
  widgetChooserFun(n){
    n.widgetChooser = !n.widgetChooser;
  }
   //Open dialog to edit
   addWidgets(layout: GridStackElement, index: number) {
    const dialogRef = this.dialog.open(WidgetsComponent, {
      width: '1200px',
      height: '810px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop:true,
      data: {panelName: layout.panelName, widget : null}
    });
    dialogRef.afterClosed().subscribe(
      result =>{
        if(result != null){
          this.customLayout.widget[index] = result.widget;
          this.customLayout.widget[index].data = JSON.stringify(this.customLayout.widget[index].actualData);
          this.customLayout.layout[index].panelName = result.panelName;
          this.previewOptions(index);
        }
      }
    )
    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });
  }
  getDefaultDasboard(){
    this.customService.getDefaultDashboard().subscribe(res =>{
      let layout = res;
      layout.widget.map((element)=>{
      element.actualData = JSON.parse(element.data);
      });
    },err =>{
      if(err.error){
        // this.customLayout.defaultDashboard = true
        this.customLayout.dynamicDashboardUsers = ['all']
      }
    }
    )
  }

     //Open Settings
    openSettings(layout: GridStackElement, index: number  ) {
      this.customLayout.widget[index].actualData = JSON.parse(this.customLayout.widget[index].data);
      this.customLayout.widget[index].totalCount=this.customLayout.widget[index].totalCount
     const dialogRef = this.dialog.open(WidgetsSettingsComponent, {
       width: '1200px',
       height: '810px',
       panelClass: 'dialog-theme-light',
       backdropClass: 'backdropBackground-theme-light',
       hasBackdrop:true,
       data: {panelName :layout.panelName, widget : this.customLayout.widget[index], layoutID : this.customLayout.id} ,
     });
     dialogRef.afterClosed().subscribe(
       result =>{

         if(result != null){
           this.customLayout.widget[index] = result.widget;
           this.customLayout.widget[index].data = JSON.stringify(result.widget.actualData);
           this.customLayout.widget[index].totalCount = result?.widget?.actualData?.count;
           this.customLayout.layout[index].panelName = result.panelName;
           if(this.customLayout.widget[index].type=='table'){
            this.tableArray = [];
            this.tableData = this.customLayout.widget[index]?.actualData?.data;
            this.tableDataIndex[index]=this.tableData;
            this.tableArrayIndex[index]=this.tableArray;
            this.totalCount=this.customLayout.widget[index]?.actualData?.count;
            this.totalCountIndex[index]=this.totalCount;
            Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
            this.queryText=this.customLayout?.widget[index]?.queryText;
            this.queryTextForPage[index] = this.queryText;
            this.showQueryData(this.queryTextForPage[index], index);
            }
            else{
              this.previewOptions(index)
            }
          }
       }
     )
     this.router.events
     .subscribe(() => {
       dialogRef.close();
     });
   }
   currentPage:number=1;
   getPageNumbers(i: number): number[] {
    const totalCount = this.totalCountIndex[i];
    const pageSize = this.searchScope.pageSize;

    const totalPages = Math.ceil(totalCount / pageSize);
    return Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5);
  }

  nextPage(i: number): void {
    const totalCount = this.totalCountIndex[i];
    const pageSize = this.pageSizeIndex[i];

    const totalPages = Math.ceil(totalCount / pageSize);
    if (this.page < totalPages) {
      this.page++;
    }
  }
  isLastPage(i: number): boolean {
    const totalCount = this.totalCountIndex[i];
    const pageSize = this.pageSizeIndex[i];

    const totalPages = Math.ceil(totalCount / pageSize);
    return this.page+1 === totalPages;
  }

    //Open dialog to edit
  addExistingWidgets( index: number) {
    const dialogRef = this.dialog.open(WidgetsScreenComponent, {
      width: '1120px',
      height: '800px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop:true,
    });
    dialogRef.afterClosed().subscribe(
      result =>{
        if(result != null){
          let userName=sessionStorage.getItem(AUTHENTICATED_USER)
          userName=this.encryptDecryptService.decryptData(userName)  
           if(this.customLayout.userName != userName){
             this.customLayout.widget[index].id = null;
             this.customLayout.widget[index].query['id']= null;
             this.customLayout.layout[index].primaryId = null;
           }
          this.customLayout.widget[index] = result.widget;
          this.customLayout.widget[index].data = JSON.stringify(this.customLayout.widget[index].actualData);
          if(this.customLayout.widget[index].type=='table'){
            this.tableArray = [];
            this.tableData = this.customLayout.widget[index]?.actualData?.data;
            this.tableDataIndex[index]=this.tableData;
            this.tableArrayIndex[index]=this.tableArray;
            this.totalCount=this.customLayout.widget[index]?.actualData?.count;
            this.totalCountIndex[index] = this.totalCount
            Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
            // this.paginator.pageIndex=0;
            this.queryText=this.customLayout.widget[index]?.queryText;
            this.queryTextForPage[index] = this.queryText;
            this.showQueryData(this.queryTextForPage[index], index);
            }
            else{
              this.showQueryData(this.customLayout.widget[index].queryText, index);
            }
          }
      }
    )
    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });
  }

    //Open dialog to edit
    maximizeWidget(index:number) {
      this.customLayout.widget[index].actualData = JSON.parse(this.customLayout.widget[index].data);
      const dialogRef = this.dialog.open(ExistingWidgetComponent, {
        width: '88vw',
        height: '88vh',
        data: {widget : this.customLayout.widget[index],threeDim:this.threeDim[index],layoutID:this.customLayout.id},
        panelClass: 'dialog-theme-light',
        backdropClass: 'backdropBackground-theme-light',
        hasBackdrop:true,
      });
      this.router.events
      .subscribe(() => {
        dialogRef.close();
      });
    }

    goBack() {
      this.location.back();
    }
    filterQuery:any;
    filterapply:boolean=false;
   //Open apply filter
   applyFilter(layout: GridStackElement, index: number) {
    const dialogRef = this.dialog.open(TableQueryFilterComponent, {
      width: '1800px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: {panelName :layout.panelName, widget : this.customLayout.widget[index]},
      hasBackdrop:true,
    });
    dialogRef.afterClosed().subscribe(
      result =>{
        if(result != null){
          console.log(result)
          this.filterapply=true;
          this.applyFiltered[index]=this.filterapply
          this.filterVal[index] = result[2].where;
          this.filterVal2[index]=result[2].where2;
          this.customLayout.widget[index].actualData = result[0];
          this.queryText=result[1];
          this.queryTextForPage[index] = this.queryText;
          for(let i=0;i<this.filterVal[index]?.length;i++){
            if(this.filterVal[index][i]?.operandField===''){
              this.filterapply=false;
              this.applyFiltered[index]=false
            }
          }
          if(this.customLayout.widget[index].type=='table'){
          this.tableArray = [];
          this.tableData = this.customLayout.widget[index]?.actualData?.data;
          this.tableDataIndex[index]=this.tableData;
          this.tableArrayIndex[index]=this.tableArray;
          this.totalCount=this.customLayout.widget[index]?.actualData?.count;
          Object.keys(this.tableData[0] || {}).forEach(key => this.tableArray.push(key));
          this.paginator.pageIndex=0;
          this.showQueryData(this.queryTextForPage[index], index);
          }
          else {
            this.filterapply=true;
            this.previewOptions(index)
          }
        }
      }
    )
    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });
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
  createNewTemplate(){
    this.saveLoading = true;
    console.log(this.customLayout);
    this.customLayout.createdDate=this.datepipe.transform(this.createdDate,'yyyy-MM-ddTHH:mm:ss')
    this.customService.createTemplate(this.customLayout).subscribe(
      res =>{
        this.assigningData(res);
        this.saveLoading = false;
        this.openSnackBar(res['status'],'');
        sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
        window.location.reload();
        // this.goBack();
      },
      err =>{
        this.saveLoading = false;
        this.openErrSnackbar('Template Name Already Exists..Please Create a new one');
        if(err.error['error']!==null && err.error['error']!==undefined && err.error['status']!==404){
          this.openErrSnackbar(err.error['error'])
           }  
        else if(err.error['error']!==null && err.error['error']!==undefined && err.error['status']===404){
          this.openErrSnackbar('No instance available for clos-bi-tool-service')
        }
      }
    )
    // window.location.reload();
  }

  //Update New Template
  updateNewTemplate(){
    this.customLayout.createdDate=this.datepipe.transform(this.createdDate,'yyyy-MM-ddTHH:mm:ss')
    let defaultDashboard;
    if(this.customLayout?.dynamicDashboardUsers?.includes(this.getUserName) && this.customLayout?.selectedScreen?.includes('Home')){
      defaultDashboard=true;
    }
    else{
      defaultDashboard=false;
    }
    this.customService.updateTemplate(this.customLayout.id, this.customLayout).subscribe(
      res =>{
        this.assigningData(res);
        this.openSnackBar(res['status'],'');
        sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
        window.location.reload();
        // this.goBack();
      },err =>{
        this.openErrSnackbar(err);
        if(err.error['error']!==null && err.error['error']!==undefined && err.error['status']!==404){
          this.openErrSnackbar(err.error['error'])
           }  
        else if(err.error['error']!==null && err.error['error']!==undefined && err.error['status']===404){
          this.openErrSnackbar('No instance available for clos-bi-tool-service')
        }
      }
    )
  }

  assigningData(res){
    this.customLayout = res["data"];
    this.customLayout.widget.map((item) => {
      item.actualData = JSON.parse(item.data);
    });
  }

  //open snack bar
openSnackBar(message: string, action: string) {
this.snackBar.openFromComponent(SnackbarComponent, {
panelClass: ['success-snackbar'],duration: 5000,
data: {
 message: message, icon: 'done',type:'success'
}
 });
}

openErrSnackbar(message){
this.snackBar.openFromComponent(SnackbarComponent, {
panelClass: ['error-snackbar'],duration: 5000,
data: {
 message: message, icon: 'error_outline',type:'error'
}
 });
}

  public ngAfterViewInit() {
    GridStack.init(this.grid);
  // grid.on("resizestop", function(event, item: GridItemHTMLElement){
    //   sessionStorage.setItem("gridlayout", '[{x: 0, y: 0, w: 2, h: 6, id: "0"}]')
    // })
  }
  hovId: any;
  h: any;
  w: any;
  y: any;
  x: any;
  id: any;
  panel: any;
  panel_id: any;
  saveTrue: boolean = false;
  saveId: any;
  zoomBarActive:boolean=false;
  onLayoutChange(event, layout){
    if(this.zoomBarActive==false){
    for(let i = 0; i<=layout?.length; i++){
    if(layout[i]?.id == this.hovId){
       this.saveTrue = true;
       this.saveId = layout[i]?.id;
       this.h = event?.detail[0]?.h.toString();
       this.w = event?.detail[0]?.w.toString();
       this.x = event?.detail[0]?.x.toString();
       this.y = event?.detail[0]?.y.toString();
       this.id = layout[i]?.id.toString();
       this.panel = layout[i]?.panelName.toString();
       this.panel_id = layout[i]?.primaryId?.toString();
    }
    console.log(this.saveId,this.h,this.w,this.x,this.y,this.panel,this.panel_id)
  }
}
  }
  positionSave(i){
  this.customLayout.layout[i] = new GridStackElement(this.id,this.w,this.h,this.x,this.y,this.panel,this.panel_id);
  this.updateNewTemplate();
  }
  hoverCapture(id){
    this.hovId = id;
  }
  menuOpen:boolean=false;
  menuOpen1:boolean=false;
  menuOpening(){
    this.menuOpen=this.menuOpen=== true ? false :true;
  }
  menuOpening1(){
    this.menuOpen1=this.menuOpen1=== true ? false :true;
  }
  hoverStates: boolean[] = Array(this.customLayout.widget?.length).fill(false);
  setHoverState(index: number, state: boolean) {
    this.hoverStates[index] = state;
  }
  // ADDING PANEL  
  async onAddRow() {
    this.addPanelLoading = true;
    this.newId = this.customLayout.layout.length;
    var newer=this.newId+1;
    let x=0;
    let y=0;
    if(this.lengthId?.valueOf()%2!==0){
    if((this.newId + 1)%2==0){
    for(let i=0;i<(this.newId + 1);i++){
      x=0;
      y=y+6
      i++;
      }
    }
    let x1=0;
    let y1=0;
    if((this.newId + 1)%2!==0){
      for(let j=0;j<(this.newId + 1);j++){
        x=x+6;
        y=y+6;
        j++;
        }
    }
  }
  if(this.updateId?.valueOf()%2!==0){
    if((this.newId + 1)%2==0){
    for(let i=0;i<(this.newId + 1);i++){
      x=0;
      y=y+6
      i++;
      }
    }
    let x1=0;
    let y1=0;
    if((this.newId + 1)%2!==0){
      for(let j=0;j<(this.newId + 1);j++){
        x=x+6;
        y=y+6;
        j++;
        }
    }
  }

  if(this.lengthId?.valueOf()%2===0){
    if((this.newId + 1)%2!==0){
    for(let i=0;i<(this.newId + 1);i++){
      x=0;
      y=y+6
      i++;
      }
    }
    let x1=0;
    let y1=0;
    if((this.newId + 1)%2==0){
      for(let j=0;j<(this.newId + 1);j++){
        x=x+6;
        y=y+6;
        j++;
        }
    }
  }
  if(this.updateId?.valueOf()%2===0){
    if((this.newId + 1)%2!==0){
    for(let i=0;i<(this.newId + 1);i++){
      x=0;
      y=y+6
      i++;
      }
    }
    let x1=0;
    let y1=0;
    if((this.newId + 1)%2==0){
      for(let j=0;j<(this.newId + 1);j++){
        x=x+6;
        y=y+6;
        j++;
        }
    }
  }
    this.customLayout.layout.push(new GridStackElement(this.newId,'6','3',x,y,`Panel ${this.newId + 1}`));
    if(this.customLayout.id){
      await this.customService.updateTemplate(this.customLayout.id, this.customLayout).toPromise().then(
        res =>{
          this.assigningData(res);
          this.addPanelLoading = false;
        },
        err =>{
          this.addPanelLoading = false
        }
      );
    }else{
      await this.customService.createTemplate(this.customLayout).toPromise().then(
        res =>{
          this.assigningData(res);
          this.addPanelLoading = false;
        },
        err =>{
          this.addPanelLoading = false
        }
      );
    }
    sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
    window.location.reload();
    }

  //Dashboard Level Mapping
  dashboardMapping(){
    const dialogRef = this.dialog.open(TemplateMappingComponent, {
      width: '750px',
      height: '350px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      data: this.customLayout,
      hasBackdrop:true,
    });
    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });
  }

  Saving(){
    if(this.customLayout.dashboardName == 'New Template' || this.customLayout.dashboardName == ''){
      this.nameUpdate = true;
    }else{
    if(this.customLayout.id){
      this.updateNewTemplate();
    }else{
      this.createNewTemplate();
    }
  }
  }

  console(i){
    if(this.customLayout.widget[i]!==null || this.customLayout.widget[i]!==undefined){
    this.widgetid = this.customLayout.widget[i].id;
    }
  }
  deleteId:any;
  deleteValue:any=[];
  // Delete Panel
  deletePanel(){
    let widget:any
    this.customLayout.layout.splice(this.customLayout.layout.map(x => {
      return x.id
    }).indexOf(this.deleteid),1);
    if(this.widgetid){
     this.customLayout.widget.splice(this.customLayout.widget.map(x => {
        return x.id;
      }).indexOf(this.widgetid),1);
    }
    this.deleteConfrim = false;
    sessionStorage.setItem("gridlayout", JSON.stringify(this.customLayout));
    window.location.reload();
  }
  queryText:any;
  queryTextIndex=[];
  queryTextForPage=[];
  index:any;
  query:any;
  categoryData:any=[];
  candleStickData:any=[];
  previewOptions(index){
    this.threeDim[index]=false;
    const colors = ['#5470C6', '#91CC75', '#EE6666'];  
    let theme = 'theme-light';
    let bg = 'theme-light';
    this.index=index;
    sessionStorage.setItem('index',this.index);
    switch(this.customLayout.widget[index].type){
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
        // case "cardChart":
        //   this.customLayout.widget[index].graphSettings.borderBottomColor=this.customLayout.widget[index].graphSettings.borderBottomColor;
        //   this.customLayout.widget[index].graphSettings.borderTopColor=this.customLayout.widget[index].graphSettings.borderTopColor;
        //   this.customLayout.widget[index].graphSettings.borderLeftColor=this.customLayout.widget[index].graphSettings.borderLeftColor;
        //   this.customLayout.widget[index].graphSettings.borderRightColor=this.customLayout.widget[index].graphSettings.borderRightColor;
        //   this.customLayout.widget[index].graphSettings.cardTextColor=this.customLayout.widget[index].graphSettings.cardTextColor;
        //   break;
      case "lineChart":
        this.option[index] = {
          title:{
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color:this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light'?'white':'black',
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
            right:'30',
            feature: {
              dataZoom: {
                show: this.customLayout.widget[index].graphSettings.toolboxZoom,
                yAxisIndex: '10',
                realtime:'true',
                },
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              magicType: { show: this.customLayout.widget[index].graphSettings.toolboxType, type: ['line', 'bar'] },
              restore: {show: this.customLayout.widget[index].graphSettings.toolboxType},
              saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave}
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
              data: this.customLayout.widget[index].actualData.headers,
              axisLabel:{
                interval:0,
                rotate: 45,  // Start with no rotation
                formatter: function (value) {
                  // Adjust rotation based on label length
                  if (value.length > 10) {
                    return value.substring(0, 7) + '...'; // Display only a portion of long labels
                  }
                  return value;
                }
              }
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
            label:{
            textStyle: {
              color: '#777',
              textShadowColor: '#777',
              textShadowOffsetX: 1,
          }},
            showBackground: true,
            itemStyle: {
              // color: this.colorArray?this.colorArray[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   { offset: 0, color: '#83bff6' },
              //   { offset: 0.5, color: '#8fd9ce' },
              //   { offset: 1, color: 'rgb(7, 148, 173)' }
              // ])
            },
            emphasis: {
              itemStyle: {
                // color: this.colorArray?this.colorArray[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color:this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light'?'white':'black',
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
            right:'30',
            feature: {
              dataView: { show:this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
              saveAsImage: {show: this.customLayout.widget[index].graphSettings.toolboxSave}
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
              },
          ],
        };
        break;
      case "gaugeChart":
        this.option[index] = {
          title: {
          show: this.customLayout.widget[index].graphSettings.titleShow,
          text:this.customLayout.widget[index].graphSettings.titleText,
          top:-4,
          textStyle: {
            color: this.gettextColor(this.customLayout.id)
          },
          // label: {
          //   fontSize:'10',
          // },
          left:this.customLayout.widget[index].graphSettings.titleAlign
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
                  borderWidth: 4,
                  borderColor:this.gettheme(this.customLayout.id)[0]
              }
          },
          itemStyle:{
            color:this.gettheme(this.customLayout.id)[0]
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
          title:{
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left:this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color:this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light'?'white':'black',
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
            right:'30',
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
          title:{
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              // color: theme =='theme-light'?'rgba(0, 0, 0, 0.87)':'silver'
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color:this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light'?'white':'black',
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
              right:'30',
              feature: {
                dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData, readOnly: false },
                saveAsImage: { show: this.customLayout.widget[index].graphSettings.toolboxSave }
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
          title:{
            show: this.customLayout.widget[index].graphSettings.titleShow,
            text: this.customLayout.widget[index].graphSettings.titleText,
            left: this.customLayout.widget[index].graphSettings.titleAlign,
            textStyle: {
              color: this.gettextColor(this.customLayout.id)
            }
          },
          color:this.gettheme(this.customLayout.id),
          tooltip: {
            show: this.customLayout.widget[index].graphSettings.toolTipShow,
            backgroundColor: bg == 'theme-light'?'white':'black',
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
            right:'30',
            feature: {
              dataZoom: {
                show: this.customLayout.widget[index].graphSettings.toolboxZoom,
                yAxisIndex: 'none'
              },
              dataView: { show: this.customLayout.widget[index].graphSettings.toolboxData,readOnly: false },
              magicType: { show: this.customLayout.widget[index].graphSettings.toolboxType, type: ['line', 'bar'] },
              restore: {show: this.customLayout.widget[index].graphSettings.toolboxType,},
              saveAsImage: {show: this.customLayout.widget[index].graphSettings.toolboxSave,}
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
              // name:this.customLayout.widget[index].query.columnName1==undefined?'':this.customLayout.widget[index].query.columnName1,
              nameLocation:'middle',
              nameTextStyle:{
                lineHeight:40,
                fontWeight:'600'
              },
              type: this.customLayout.widget[index].graphSettings.xaxis,
              data: this.customLayout.widget[index].actualData.headers,
              axisLabel:{
                interval:0,
                rotate: 45,
                formatter: function (value) {
                  if (value.length > 10) {
                    return value.substring(0, 7) + '...';
                  }
                  return value;
                }
              }
          },
          yAxis: {
              // name:this.customLayout.widget[index].query.columnName2==undefined?'':this.customLayout.widget[index].query.columnName2,
              nameLocation:'middle',
              nameTextStyle:{
                lineHeight:70,
                fontWeight:'600'
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
              name : this.customLayout.widget[index].graphSettings.legendName,
              showBackground: true,
              label:{
                textStyle: {
                  color: '#777',
                  textShadowColor: '#777',
                  textShadowOffsetX: 1,
              }
              },
              itemStyle: {
                      // color: this.colorArray?this.colorArray[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      //   { offset: 0, color: '#83bff6' },
                      //   { offset: 0.5, color: '#8fd9ce' },
                      //   { offset: 1, color: 'rgb(7, 148, 173)' }
                      // ])
                    },
                    emphasis: {
                      itemStyle: {
                        // color: this.colorArray?this.colorArray[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
          let actualData;
           actualData = this.customLayout?.widget[index]?.actualData?.data;
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
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0, // Adjust the start value as needed
                end: 100 // Adjust the end value as needed
              }],
            yAxis: [
              {
                type: 'value',
                position: 'right',
                alignTicks: true,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id)[0]:colors[0]
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
                    color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id)[1]:colors[1]
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
                    color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id)[2]:colors[2]
                     }
                },
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name:this.customLayout.widget[index].graphSettings.legendName,
                type: 'bar',
                data: bar1,
                label:{
                  textStyle: {
                    color: '#777',
                    textShadowColor: '#777',
                    textShadowOffsetX: 1,
                }
                },
                color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id)[0]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#8fd9ce' },
                  { offset: 1, color: 'rgb(7, 148, 173)' }
                ])
              },
              {
                type: 'bar',
                name:this.customLayout.widget[index].graphSettings.legendName2,
                yAxisIndex: 1,
                data: bar2,
                label:{
                  textStyle: {
                    color: '#777',
                    textShadowColor: '#777',
                    textShadowOffsetX: 1,
                }},
                color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id)[1]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#8fd9ce' },
                  { offset: 1, color: 'rgb(7, 148, 173)' }
                ])
              },
              {
                type: 'line',
                name:this.customLayout.widget[index].graphSettings.legendName3,
                yAxisIndex: 1,
                data: line,
                label:{
                  textStyle: {
                    color: '#777',
                    textShadowColor: '#777',
                    textShadowOffsetX: 1,
                }},
                color: this.gettheme(this.customLayout.id)?this.gettheme(this.customLayout.id)[2]:new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#8fd9ce' },
                  { offset: 1, color: 'rgb(7, 148, 173)' }
                ])
              },
            ]
          };
          break;
          case "candleStick":{
            let upColor = '#00da3c';
            let downColor = '#ec0000';
            let col
            let actualData;
            actualData = this.customLayout?.widget[index]?.actualData?.data;
            const Date = actualData.map(item => item.Date);
            const Amount = actualData.map(item => item.Amount);
            const High = actualData.map(item => item.High);
            const Close = actualData.map(item => item.Close);
            this.categoryData=Date;
            const Low = actualData.map(item => item.Low);
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
          this.option[index]={
            title:{
              show: this.customLayout.widget[index].graphSettings.titleShow,
              text: this.customLayout.widget[index].graphSettings.titleText,
              left: this.customLayout.widget[index].graphSettings.titleAlign,
              textStyle: {
                color: this.gettextColor(this.customLayout.id)
              }
            },
          animation: false,
          legend: {
            data: [this.customLayout.widget[index].graphSettings.legendName],
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
            // extraCssText: 'width: 170px'
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
              height: '52%' // Adjust the height as needed
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
              axisLabel: {
                margin: 42
              },
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
            },
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 0, // Adjust the start value as needed
              end: 100 // Adjust the end value as needed
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '90%',
              start: 0, // Adjust the start value as needed
              end: 100 // Adjust the end value as needed
            }
          ],
          series: [
            {
              name: this.customLayout.widget[index].graphSettings.legendName,
              type: 'candlestick',
              data: this.candleStickData,
              itemStyle: {
                color: upColor,
                color0: downColor,
                borderWidth:1,
                borderColor: undefined,
                borderColor0: undefined
              }
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
          }]
        }
      }
    }
  }
  indexes:any;
  loadMoreGraphs:number=0;
  loadGraph=[];
  loadGraphCount:number;
  showQueryData(queryText:any, i){
    if(this.customLayout?.widget[i]?.type=='card'){
      this.customLayout.widget[i].type='cardChart'
    }
    this.tabLoading = true;
    this.tabLoadIndex[i] = this.tabLoading
    this.isLoading[i]=true;
    // this.paginator.pageSize=this.searchScope.pageSize;
    this.pageSizeIndex[i] = this.searchScope.pageSize
    this.indexes=sessionStorage.getItem('index')
    this.customService.getQueryData(this.customLayout?.widget[i].type, queryText,this.page+1 ,this.pageSizeIndex[i]).subscribe(
      res=>{
        this.tabLoading = false;
        this.isLoading[i]=false
        this.tabLoadIndex[i] = this.tabLoading
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
  clearFilter(i){
    this.tabLoading = true;
    this.tabLoadIndex[i] = this.tabLoading;
    this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.page+1,this.searchScopeOfGraph.pageSize).subscribe(
      res=>{
        this.tabLoading = false;
        this.tabLoadIndex[i] = this.tabLoading
        if(this.customLayout?.widget[i].type==='table'){
          this.tableArray=[];
        this.tabLoadIndex[i] = this.tabLoading
        this.tableData = res['data'];
        this.totalCount=res['count'];
        this.tableDataIndex[i]=this.tableData;
        this.totalCountIndex[i]=this.totalCount;
        this.tableArrayIndex[i]=this.tableArray;
        Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
        }
        if(this.customLayout?.widget[i]?.type=='card'||this.customLayout?.widget[i]?.type=='cardChart'||this.customLayout?.widget[i]?.type=='gaugeChart'){
           this.customService.getQueryData(this.customLayout?.widget[i].type,this.customLayout?.widget[i].queryText,this.loadMoreGraphs+1,this.searchScopeOfGraph.pageSize).subscribe(
             res=>{
               this.customLayout.widget[i].actualData.value=res['value']
               this.previewOptions(i)
             },err=>{
              this.isLoading[i]=false;
              console.log(err.error)
            }
           )
        }
        if(this.customLayout?.widget[i]?.type=='barChart'){
          this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.loadMoreGraphs+1,this.searchScopeOfGraph.pageSize).subscribe(
            res=>{
              let headers:any[]=[];
              headers=res['headers'];
              headers?.forEach(e=>{
                this.customLayout?.widget[i]?.actualData?.headers?.push(e)
              })
              let dataOfBar:any[]=[];
              dataOfBar=res['data'];
              this.barCount=res['count'];
              this.totalLoadMoreCount[i]=this.barCount
              dataOfBar?.forEach(e=>{
                this.customLayout?.widget[i]?.actualData?.data?.push(e)
              })
              this.previewOptions(i);
              this.fieldValueCount[i]=this.barCount;
              },err=>{
                this.isLoading[i]=false;
                console.log(err.error)
              }
          )
      }
      if(this.customLayout?.widget[i]?.type=='pieChart'){
        this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.loadMorePie+1,this.searchScopeOfGraph.pageSize).subscribe(
          res=>{
            let dataPie:any[]=[];
            dataPie=res['data'];
            this.pieCount=res['count']
            this.totalLoadMoreCount[i]=this.pieCount
            dataPie?.forEach(e=>{
              this.customLayout.widget[i].actualData.data?.push(e)
            })
            if(dataPie?.length===this.pieCount){
              this.loadMoreData=false;
            }
            this.previewOptions(i);
            this.fieldValueCount[i]=this.pieCount;
          },err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
        )
      }
      if(this.customLayout?.widget[i].type=='funnelChart'){
        this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.loadMoreFunnel+1,this.searchScopeOfGraph.pageSize).subscribe(
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
      if(this.customLayout?.widget[i].type=='donutChart'){
        this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.loadMoreDonut+1,this.searchScopeOfGraph.pageSize).subscribe(
          res=>{
            let dataOfDonut:any[]=[];
              dataOfDonut=res['data'];
              this.donutCount=res['count']
              this.totalLoadMoreCount[i]=this.donutCount;
              dataOfDonut?.forEach(e=>{
                this.customLayout.widget[i].actualData.data?.push(e)
              })
              this.previewOptions(i);
              this.fieldValueCount[i]=this.donutCount;
              },err=>{
                this.isLoading[i]=false;
                console.log(err.error)
              }
        )
      }
      if(this.customLayout?.widget[i].type=='lineChart'){
        this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.loadMoreLine+1,this.searchScopeOfGraph.pageSize).subscribe(
          res=>{
            let headersOfLine:any[]=[];
            headersOfLine=res['headers'];
            headersOfLine?.forEach(e=>{
              this.customLayout?.widget[i]?.actualData?.headers?.push(e)
            })
            let dataOfLine:any[]=[];
            dataOfLine=res['data']
            dataOfLine?.forEach(e=>{
              this.customLayout.widget[i].actualData.data?.push(e)
              this.previewOptions(i)
            })
            this.fieldValueCount[i]=dataOfLine;
          },err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
        )
      }
      if(this.customLayout?.widget[i]?.type=='candleStick'){
          this.customService.getQueryData(this.customLayout?.widget[i]?.type,this.customLayout.widget[i].queryText,this.loadMoreCandle+1,this.searchScopeOfGraph.pageSize).subscribe(
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
          }
          ,err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
        )
    }
      },err =>{
        this.error = err.error;
        this.tabLoading = false;
        this.tabLoadIndex[i] = this.tabLoading
      }
    )
  }
  searchScopeOfGraph:SearchScope=new SearchScope(10,'graph')
  pageSizeIndexOfGraph=[];
  loadMore:boolean=false;
  pageNum=[];
  pageNumber=[];
  graphCount:number;
  loadMorePie:number=0;
  loadMoreFunnel:number=0;
  loadMoreDonut:number=0;
  barCount:number;
  donutCount:number;
  funnelCount:number;
  pieCount:number;
  loadMoreData:boolean=true;
  loadMoreLine:number=1;
  totalLoadMoreCount=[];
  fieldValueCount=[];
  isLoading=[];
  loadPrevDonut:number=0;
  loadPrevPage:boolean=false;
  loadMoreMultiple:number=1;
  loadMoreCandle:number=0;
  loadMoreGraph(i){
     this.tabLoading=true;
     this.pageSizeIndexOfGraph[i]=this.searchScopeOfGraph.pageSize
     this.isLoading[i]=this.tabLoading;
     
     if(this.loadMore==true && this.customLayout?.widget[i]?.type=='barChart'){
       this.loadMoreGraphs=this.loadMoreGraphs+1;
     }
     if(this.loadMore==true && this.customLayout?.widget[i]?.type=='pieChart'){
       this.loadMorePie=this.loadMorePie+1;
     }
     if(this.loadMore==true && this.customLayout?.widget[i]?.type=='funnelChart'){
       this.loadMoreFunnel=this.loadMoreFunnel+1;
     }
     if(this.loadMore==true && this.customLayout?.widget[i]?.type=='donutChart'){
       this.loadMoreDonut=this.loadMoreDonut+1;
     }
     if(this.loadMore==true && this.customLayout?.widget[i].type=='lineChart'){
       this.loadMoreLine=this.loadMoreLine+1;
     }
     if(this.loadMore==true && this.customLayout?.widget[i].type=='multipleChart'){
      this.loadMoreLine=this.loadMoreMultiple+1;
    }
    if(this.loadMore==true && this.customLayout?.widget[i].type=='candleStick'){
      this.loadMoreCandle=this.loadMoreCandle+1;
    }
     let type;
     if(this.threeDim[i]===true){
       type=this.optionsthreeDim[i]?.chart?.type
     }
     else{
       type=this.customLayout?.widget[i]?.type;
     }
     if(type=='pie'){
       type='pieChart'
     }
     if(type=='funnel3d'){
       type='funnelChart'
     }
     if(this.customLayout?.widget[i]?.type=='donutChart' && type=='pie'){
       type='donutChart'
     }
     if(this.customLayout?.widget[i]?.type=='barChart'){
      if(this.loadPrevPage==true){
        this.loadMoreGraphs=this.loadMoreGraphs-2;
      }
      this.customService.getQueryData('barChart',this.customLayout.widget[i].queryText,this.loadMoreGraphs+1,this.pageSizeIndexOfGraph[i]).subscribe(
        res=>{
          this.isLoading[i]=false;
          let headers:any[]=[];
          headers=res['headers'];
          let dataOfBar:any[]=[];
          dataOfBar=res['data'];
          this.barCount=res['count'];
          this.totalLoadMoreCount[i]=this.barCount
          if(this.loadPrevPage==true){
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
            this.customLayout?.widget[i]?.actualData?.headers?.splice(-10,this.customLayout?.widget[i]?.actualData?.headers?.length)
          }else{
            dataOfBar?.forEach(e=>{
              this.customLayout.widget[i].actualData.data?.push(e)
            })
            headers?.forEach(e=>{
              this.customLayout?.widget[i]?.actualData?.headers?.push(e)
            })
          }
          if(this.threeDim[i]===true){
            this.preview3dOptions(i,'barChart')
          }
          else{
          this.previewOptions(i);
          }
          this.loadPrevPage=false;
          this.fieldValueCount[i]=dataOfBar;
          },err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
      )
  }
  if(type=='pieChart'){
    if(this.loadPrevPage==true){
      this.loadMorePie=this.loadMorePie-2;
    }
    this.customService.getQueryData(type,this.customLayout.widget[i].queryText,this.loadMorePie+1,this.pageSizeIndexOfGraph[i]).subscribe(
      res=>{
        this.isLoading[i]=false;
        let dataPie:any[]=[];
        dataPie=res['data'];
        this.pieCount=res['count']
        this.totalLoadMoreCount[i]=this.pieCount
        if(this.loadPrevPage==true){
          this.customLayout?.widget[i]?.actualData?.data?.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
        }else{
          dataPie?.forEach(e=>{
            this.customLayout.widget[i].actualData.data?.push(e)
          })
        }
        if(this.threeDim[i]===true){
          this.preview3dOptions(i,'pieChart')
        }
        else{
        this.previewOptions(i);
        }
        this.loadPrevPage=false;
        this.fieldValueCount[i]=dataPie?.length;
      },err=>{
        this.isLoading[i]=false;
        console.log(err.error)
      }
    )
  }
  if(type=='funnelChart'){
    if(this.loadPrevPage==true){
      this.loadMoreFunnel=this.loadMoreFunnel-2;
    }
    this.customService.getQueryData(type,this.customLayout.widget[i].queryText,this.loadMoreFunnel+1,this.pageSizeIndexOfGraph[i]).subscribe(
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
          if(this.threeDim[i]===true){
            this.preview3dOptions(i,'funnelChart')
          }
          else{
          this.previewOptions(i);
          }
          this.loadPrevPage=false;
          this.fieldValueCount[i]=data?.length;
        },err=>{
          this.isLoading[i]=false;
          console.log(err.error)
        }
    )
  }
  if(this.customLayout?.widget[i].type=='donutChart'){
    if(this.loadPrevPage==true){
      this.loadMoreDonut=this.loadMoreDonut-2;
    }
    this.customService.getQueryData(type,this.customLayout.widget[i].queryText,this.loadMoreDonut+1,this.pageSizeIndexOfGraph[i]).subscribe(
      res=>{
        this.isLoading[i]=false;
        let dataOfDonut:any[]=[];
          dataOfDonut=res['data'];
          this.donutCount=res['count']
          this.totalLoadMoreCount[i]=this.donutCount;
          if(this.loadPrevPage==true){
            this.customLayout?.widget[i]?.actualData?.data?.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
          }else{
            dataOfDonut?.forEach(e=>{
              this.customLayout.widget[i].actualData.data?.push(e)
            })
          }
          if(this.threeDim[i]==true){
            this.preview3dOptions(i,'donutChart')
          }
          else{
          this.previewOptions(i);
          }
          this.loadPrevPage=false;
          this.fieldValueCount[i]=dataOfDonut?.length;
          },err=>{
            this.isLoading[i]=false;
            console.log(err.error)
          }
         
    )
  }
  if(this.customLayout?.widget[i].type=='lineChart'){
    if(this.loadPrevPage==true){
      this.loadMoreLine=this.loadMoreLine-2;
    }
    this.customService.getQueryData(this.customLayout.widget[i].type,this.customLayout.widget[i].queryText,this.loadMoreLine+1,this.pageSizeIndexOfGraph[i]).subscribe(
      res=>{
        this.isLoading[i]=false;
        let headersOfLine:any[]=[];
        headersOfLine=res['headers'];
        let dataOfLine:any[]=[];
        dataOfLine=res['data']
        if(this.loadPrevPage==true){
          this.customLayout?.widget[i]?.actualData?.data?.splice(-10,this.customLayout?.widget[i]?.actualData?.data?.length)
          this.customLayout?.widget[i]?.actualData?.headers?.splice(-10,this.customLayout?.widget[i]?.actualData?.headers?.length)
        }else{
          dataOfLine?.forEach(e=>{
            this.customLayout.widget[i].actualData.data?.push(e)
            this.customLayout?.widget[i]?.actualData?.headers?.push(e)
          })
        }
        if(this.threeDim[i]==true){
          this.give3dCharts(i,'line3D')
        }
        else{
        this.previewOptions(i);
        }
        this.loadPrevPage=false;
        this.fieldValueCount[i]=dataOfLine?.length;
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
  }
  give3dCharts(index,typechart){
    localStorage.setItem('typeOfChart',typechart)
    this.threeDim[index]=false;
    const chart = echarts?.init(document.getElementById(index));
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
          data: this.customLayout?.widget[index]?.actualData?.data,
          headers: this.customLayout?.widget[index]?.actualData?.headers,
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
  @ViewChild('chartContainer') chartContainer: ElementRef;
  give3DPie(index) {
    const chartData = this.customLayout?.widget[index]?.actualData?.data;
    const pieData = chartData?.map(item => [item.name, item.value]);

    // Check if the DOM element with the specified index exists
    const chartContainerId = index?.toString();
    const chartContainer = document.getElementById(chartContainerId);

    if (chartContainer) {
        Highcharts.chart(chartContainer, {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0,
                }
            },
            title: {
                text: '3D Pie Chart',
            },
            plotOptions: {
                pie: {
                    depth: 60,
                    dataLabels: {
                        enabled: true,
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Pie',
                data: pieData,
            }]
        });
    }
    else {
        console.error(`Element with id "${chartContainerId}" not found.`);
    }
}

give3DDonut(index){
  const chartData = this.customLayout?.widget[index]?.actualData?.data;
  const pieData = chartData?.map(item => [item.name, item.value]);
  let pieId=document.getElementById(index)
  Highcharts.chart(pieId, {
      chart: {
          type: 'pie',
          options3d: {
              enabled: true,
              alpha: 45,
          }
      },
      title: {
          text: '3D Pie Chart',
      },
       credits:{
        enabled:false
      },
      accessibility:{
        enabled:false,
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45,
          dataLabels:{
            enabled:true,
          }
      }
      },
      series: [{
          type: 'pie',
          name: 'Pie',
          data: pieData,
      }]
  });
}
alpha:any=45;
beta:any=0;
preview3dOptions(index, typeOfChart) {
  localStorage.setItem('typeOfChart',typeOfChart)
  if (this.customLayout?.widget[index]?.type !== 'table') {
    this.threeDim[index] = true;
    this.zoomBarActive=true;
    let seriesData;
    const chartData = this.customLayout?.widget[index]?.actualData?.data;
    const haeders=this.customLayout?.widget[index]?.actualData?.headers;
    const pieData = chartData?.map(item => [item.name, item.value]);
    const donutData = chartData?.map(item => [item.name, item.value]);
    if(this.customLayout?.widget[index]?.type == 'barChart' || this.customLayout?.widget[index]?.type == 'lineChart' || this.customLayout?.widget[index]?.type == 'line3D' || this.customLayout?.widget[index]?.type == 'bar3D'){
      seriesData=chartData;
    }
    else{
      seriesData=chartData?.map(item => [item.name, item.value]);
    }
    switch (typeOfChart) {
      case "barChart":{
        this.optionsthreeDim[index] = {
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
            categories:haeders
          },
          title: {
            text: this.customLayout.widget[index].graphSettings?.titleText,
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
        this.optionsthreeDim[index] = {
          chart: {
            type: 'line',
            styledMode:true,
            options3d: {
              enabled: true,
              alpha: 14,
              beta: 0,
              depth:50
            }
          },
          xAxis:{
            categories:this.customLayout.widget[index].actualData?.headers
          },
          title: {
            text: this.customLayout.widget[index].graphSettings?.titleText,
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
      case"multipleChart":{
        this.optionsthreeDim[index] = {
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
            categories:this.customLayout.widget[index].actualData?.headers
          },
          title: {
            text: this.customLayout.widget[index].graphSettings?.titleText,
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
      case "pieChart": {
        this.optionsthreeDim[index] = {
          chart: {
            type: 'pie',
            inverted: true,
            styledMode:true,
            options3d: {
              enabled: true,
              alpha: this.alpha,
              beta: this.beta,              
            }
          },
          title: {
            text: this.customLayout.widget[index].graphSettings.titleText,
          },
          credits:{
            enabled:false
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
              cumulative:0
            }
          },
          series: [{
            type: 'pie',
            name: 'Pie',
            data: chartData,
          }]
        };
        break;
      }
      case "donutChart": {
        this.optionsthreeDim[index] = {
          chart: {
            type: 'pie',
            styledMode:true,
            options3d: {
              enabled: true,
              alpha: this.alpha,
              beta: this.beta,
            }
          },
          title: {
            text: this.customLayout.widget[index].graphSettings.titleText,
          },
          credits:{
            enabled:false
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
        this.optionsthreeDim[index] = {
          chart: {
            type: 'funnel3d',
            styledMode:true,
            options3d: {
              enabled: true,
              alpha: 20,
              depth: 50,
              viewDistance: 50,
            }
          },
          title: {
            text: this.customLayout.widget[index].graphSettings.titleText
          },
          credits:{
            enabled:false
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
      case 'ganttChart':{
        // Sample Gantt chart configuration
          this.optionsthreeDim[index]= {
            chart: {
              type: 'xrange'
            },
            title: {
              text: 'Gantt Chart'
            },
            accessibility: {
              enabled: false
            },
            xAxis: {
              type: 'datetime',
              min: Date.UTC(2021, 0, 1),
              max: Date.UTC(2022, 0, 1),
              title: {
                text: 'Date'
              }
            },
            yAxis: {
              categories: ['Trade 1', 'Trade 2', 'Trade 3', 'Trade 4'],  // Categories for the y-axis (tasks)
              title: {
                text: 'Trade'
              }
            },
            series: [{
              name: `${this.userName}`,
              dataLabels: {
                enabled: true
              },
              data: [{
                x: Date.UTC(2021, 0, 5),
                x2: Date.UTC(2021, 0, 15),
                y: 0,
                partialFill: 0.25,
                color: 'lightgreen'
              },
              {
                x: Date.UTC(2021, 0, 20),
                x2: Date.UTC(2021, 1, 5),
                y: 1,
                partialFill: 0.5,
                color: 'lightblue'
              },
              {
                x: Date.UTC(2021, 1, 10),
                x2: Date.UTC(2021, 2, 1),
                y: 2,
                partialFill: 0.75,
                color: 'lightpink'
              },
              {
                x: Date.UTC(2021, 2, 10),
                x2: Date.UTC(2021, 3, 1),
                y: 3,
                partialFill: 0.4,
                color: 'lightgrey'
              }]
            }]
    };
    break;
  }
      default:
        console.error(`Unsupported chart type: ${this.customLayout?.widget[index]?.type}`);
        break;
    }
  }
}
giveGanttCharts(index) {

  if (!this.optionsthreeDim[index]) {
    this.optionsthreeDim[index] = {};
  }

  this.optionsthreeDim[index] = {
    chart: {
      type: 'xrange'
    },
    title: {
      text: 'Gantt Chart'
    },
    accessibility: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      min: Date.UTC(2021, 0, 1),
      max: Date.UTC(2022, 0, 1),
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      categories: ['Trade 1', 'Trade 2', 'Trade 3', 'Trade 4'],  // Categories for the y-axis (tasks)
      title: {
        text: 'Trade'
      }
    },
    series: [{
      name: `${this.userName}`,
      data: [{
        x: Date.UTC(2021, 0, 5),
        x2: Date.UTC(2021, 0, 15),
        y: 0,
        partialFill: 0.25,
        color: 'lightgreen'
      },
      {
        x: Date.UTC(2021, 0, 20),
        x2: Date.UTC(2021, 1, 5),
        y: 1,
        partialFill: 0.5,
        color: 'lightblue'
      },
      {
        x: Date.UTC(2021, 1, 10),
        x2: Date.UTC(2021, 2, 1),
        y: 2,
        partialFill: 0.75,
        color: 'lightpink'
      },
      {
        x: Date.UTC(2021, 2, 10),
        x2: Date.UTC(2021, 3, 1),
        y: 3,
        partialFill: 0.4,
        color: 'lightgrey'
      }]
    }]
  };

  return this.optionsthreeDim[index];
}
apply3dTheme(){
  fetch(`assets/${this.selectedTheme}-theme.json`)
  .then(response => response.json())
  .then(themeObject => {
    this.backgroundColor = themeObject.backgroundColor;
    this.colorArray = themeObject.color;
    this.modifiedColors= [...this.colorArray];
    this.textColor = themeObject.title.textStyle.color
    this.optionsthreeDim.forEach((chartOption, index) => {
      const chartData = this.customLayout?.widget[index]?.actualData?.data;
      const pieData = chartData?.map(item => [item.name, item.value]);
      const donutData = chartData?.map(item => [item.name, item.value]);
      switch(this.customLayout?.widget[index]?.type){
        case "pieChart":
          this.optionsthreeDim[index] = {
            chart: {
              type: 'pie',
              inverted: true,
              options3d: {
                enabled: true,
                alpha: this.alpha,
                beta: this.beta,              
              }
            },
            title: {
              text: this.customLayout.widget[index].graphSettings.titleText,
              color:this.textColor,
            },
            credits:{
              enabled:false
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
                cumulative:0
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
    }
    )
  })
}



giveMultipleCharts(index){
           localStorage.setItem('typeOfChart','multipleChart')
          const actualData = this.customLayout?.widget[index]?.actualData?.data;
          const labels = actualData.map(item => item.label);
          const values = actualData.map(item => item.value);
          const names = actualData.map(item => item.name);
          const colors = ['#5470C6', '#91CC75', '#EE6666'];  
          this.option[index] = {
            color: this.colorArray?this.colorArray:['#5470C6','#91CC75','#EE6666','#73C0DE','#3BA272','#FC8452','#9A60B4','#EA7CCC'],
         
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
              text: this.customLayout.widget[index].graphSettings.titleText
            },
            legend: {
              data: [this.customLayout.widget[index].graphSettings.legendName]
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
formatDate(dateString) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
updateAngle(i) {
  if (this.zoomBarActive==true) {
    const index = i;
    this.optionsthreeDim[index].chart.options3d.alpha = this.alpha;
    this.optionsthreeDim[index].chart.options3d.beta = this.beta;
    this.changeDetectorRef.detectChanges();
  }
  this.preview3dOptions(i, this.customLayout?.widget[i]?.type);
}

timer:any;
onChangeAngles(event){
  if (event != null) {
    if (event.length > 0 || event.length == undefined) {
      clearTimeout(this.timer);
      for(let i=0;i<this.customLayout?.widget?.length;i++){
      this.timer = setTimeout(() => { this.updateChartAngles(i,this.alpha,this.beta) }, 1000)
      }
    }
  }
}

updateChartAngles(index, alpha, beta) {
  const chartOptions = this.optionsthreeDim[index];
  alpha=this.alpha+45;
  beta=this.alpha-45;

  if (chartOptions) {
    // Update the alpha and beta values in the options3d object
    chartOptions.options3d.alpha = alpha;
    chartOptions.options3d.beta = beta;

    // Redraw the chart to apply the new angles
    chartOptions?.redraw();
  }
}


  onPaginateChangeOfQuery(event,i){
    this.showQueryData(this.queryTextForPage[i], i);
  }

 //Common Download method
 downloadAsFile(res, export_fileName, format: string,index) {
  let data = [res];
  let date = new Date();
  let latest_date = this.datepipe.transform(date, 'yyyyMMdd_hhmmss');
  let type = ''
  var types;
  if(this.customLayout.widget[index].type==='table'){
   types=this.customLayout.widget[index].graphSettings.tableName
    }
  else if(this.customLayout.widget[index].type==='cardChart'){
   types=this.customLayout.widget[index].graphSettings.labelName
  }
  else{
 types=this.customLayout.widget[index].graphSettings.titleText
  }
  if(export_fileName == types && format == 'xlsx'){
   type ='application/zip'
  }
  if(export_fileName == types && format == 'csv'){
    type ='application/zip'
   }
 var blob = new Blob(data, { type: type + format });
  var url = window.URL.createObjectURL(blob);
  var anchor = document.createElement("a");
  if(export_fileName == types && format == 'xlsx'){
    anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
  }
 else if(export_fileName == types && format == 'xls'){
    anchor.download = `${export_fileName}_${latest_date}.` + 'zip';
  }
  else if(export_fileName == types && format == 'csv'){
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

  downloadLayout(exportType,index:number) {
    this.savingByAccount = true;
    this.openSnackBar('Your Download has Started', null)
    let query;
    if(this.filterapply==true){
      query=this.queryTextForPage[index]
    }
    else{
      query=this.customLayout.widget[index].queryText
    }
    let type
    if(this.customLayout.widget[index].type==='table'){
      type=this.customLayout.widget[index].graphSettings.tableName
    }
    else if(this.customLayout.widget[index].type==='card'||this.customLayout.widget[index].type==='cardChart'){
      type=this.customLayout.widget[index].graphSettings.labelName
    }
    else{
      type=this.customLayout.widget[index].graphSettings.titleText
    }
    this.downloadStatusSubscription = this.customService.getExportOfLayout(query, exportType, this.customLayout.id,type).subscribe(
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
                  if(this.customLayout.widget[index].type==='table'){
                    type=this.customLayout.widget[index].graphSettings.tableName
                  }
                  else if(this.customLayout.widget[index].type==='cardChart'){
                    type=this.customLayout.widget[index].graphSettings.labelName
                  }
                  else{
                    type=this.customLayout.widget[index].graphSettings.titleText
                  }
                  this.downloadAsFile(res, type, exportType,index);
                  this.opensnackBar('Downloaded Successfully', null);
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
  droppedWidgets: any[] = [];

  onWidgetDropped(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      // If the widget is moved within the same container, reorder the array.
      moveItemInArray(this.droppedWidgets, event.previousIndex, event.currentIndex);
    } else {
      // If the widget is dropped from the "Existing Widget" component, add it to the "New Widget" component.
      this.droppedWidgets.splice(event.currentIndex, 0, event.item.data);
    }
  }
  create3DPieChart(index) {
    // Generate a unique ID for the chart container based on the index
    const containerId = index;
    const chartData = this.customLayout?.widget[index]?.actualData?.data;
    let pieId=document.getElementById(index)
    if (!chartData || !Array.isArray(chartData)) {
        console.error('Data is missing or not in the expected format.');
        return;
    }
    const pieData = chartData.map(item => [item.name, item.value]);

    // Create a div element with the generated ID
    const chartContainer = document.getElementById(index);
    chartContainer.id = containerId;

    // Append the chart container to your desired parent element (e.g., a widget)
    // You should adjust this part based on your specific widget structure
    const parentElement = document.getElementById(chartContainer.id);
    parentElement.appendChild(chartContainer);

    // Use the generated container ID to create the chart
    Highcharts.chart(chartContainer.id, {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
            },
        },
        title: {
            text: '3D Pie Chart',
        },
        plotOptions: {
            pie: {
                depth: 35,
            },
        },
        series: [
            {
                type: 'pie',
                name: 'Sample Data',
                data:
                   pieData
            },
        ],
    });
}

  //Delete-Export
  deleteExport(id){
    this.customService?.getDeleteExport(id).subscribe(
      res=>{
        this.openSnackBar(res['status'],null)
      }
    )
  }
  //Cancel-Export
  cancelExport(){
    this.popup=false;
    this.downloadStatusSubscription.unsubscribe();
    this.savingByAccount=false;
  }

 
  ngOnDestroy():void{
    if(this.currentJob?.id!==null && this.currentJob?.id!==undefined && this.savingByAccount==true){
      this.deleteExport(this.currentJob?.id);
      this.cancelExport();
      }  }
  closeDrawer() {
    this.drawer.close();
    this.drawer2.close();
  }
  closeDrawer1() {
    this.drawer2.close();
  }
  default(){
    localStorage.removeItem('typeOfChart')
  }
  isSelected: boolean[] = [false, false, false, false, false, false];
  selectedTheme: string = '';
  widgetId:any;
  colorArray!: string[];
  backgroundColor: string = '';
  textColor: string = '';
  modifiedColors: any;
  tableColor:string='';
  lightBkcolor:string=''
  darkBkcolor:string='';
  cardleft:string='';
  cardright:string='';
  cardtop:string='';
  cardbottom:string='';
  cardcolor:string='';
  cardtxt:string='';
  themeapplied:boolean=false;
  toggleCheckmark(index: number) {
    this.themeapplied=true;
    this.isSelected.fill(false);
    this.isSelected[index] = true;
    // Set the selected theme based on the index
    this.selectedTheme = this.getThemeName(index);
    localStorage.setItem('selectedTheme',this.selectedTheme)
    // Apply the selected theme
    this.applyTheme();
    // this.apply3d(this.selectedTheme);

  }
  getThemeName(index: number): string {
    // Define a mapping from index to theme names
    const themeNames = ['vintage', 'dark', 'westeros', 'infographic', 'roma', 'halloween'];

    // Return the theme name based on the index
    return themeNames[index];
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
  // apply3d(mode: string) {
  //   const container = document.getElementById('container');
  //   if (container) {
  //     container.className = mode === 'none' ? '' : `highcharts-${mode}`;
  //     // console.log(mode);
  //   }
  // }
  applyTheme() {
    this.fetchTheme();
    // Use an HTTP request to load the selected theme JSON file
    fetch(`assets/${this.selectedTheme}-theme.json`)
      .then(response => response.json())
      .then(themeObject => {
        this.backgroundColor = themeObject.backgroundColor;
        this.colorService.setBckColor(this.customLayout.id.toString(),this.backgroundColor)
        this.colorArray = themeObject.color;
        this.modifiedColors= [...this.colorArray];
        const themecolor = JSON.stringify(this.colorArray);
        localStorage.setItem('colorArraymaximize',themecolor);
        this.textColor = themeObject.title.textStyle.color;
        this.cardtxt = themeObject.title.textStyle.color;
        this.colorService.setTextColor(this.customLayout.id.toString(),themeObject.title.textStyle.color);
        localStorage.setItem('textColor',this.textColor);
        this.darkBkcolor = themeObject.color[0]; // This is your original color in hex or RGB format
        this.customLayout.widget[0].graphSettings.headerBg=this.darkBkcolor;
        this.customLayout.widget[0].graphSettings.bodyBg=this.hexToRGBA(this.darkBkcolor,0.5);
        this.customLayout.widget[0].graphSettings.bodyColor=themeObject.title.textStyle.color;
        this.cardleft = themeObject.color[0];
        this.cardright = themeObject.color[0];
        this.cardtop = themeObject.color[0];
        this.cardbottom = themeObject.color[0];
        for(let i=0;i<this.customLayout.widget.length;i++){
          this.customLayout.widget[i].graphSettings.cardColor=this.hexToRGBA(themeObject.color[0],0.5)
          this.customLayout.widget[i].graphSettings.borderTopColor=themeObject.color[0];
          this.customLayout.widget[i].graphSettings.borderBottomColor=themeObject.color[0];
          this.customLayout.widget[i].graphSettings.borderLeftColor=themeObject.color[0];
          this.customLayout.widget[i].graphSettings.borderRightColor=themeObject.color[0];
          this.customLayout.widget[i].graphSettings.cardTextColor=themeObject.title.textStyle.color;
          }
        localStorage.setItem('headercolor',this.darkBkcolor);
        this.colorService.setthColor(this.customLayout.id.toString(),this.darkBkcolor);
        this.colorService.setcardlColor(this.customLayout.id.toString(),this.cardleft);
        this.colorService.setcardrColor(this.customLayout.id.toString(),this.cardright);
        this.colorService.setcardtColor(this.customLayout.id.toString(),this.cardtop);
        this.colorService.setcardbColor(this.customLayout.id.toString(),this.cardbottom);
        this.colorService.setcardTxt(this.customLayout.id.toString(),this.cardtxt);
        this.lightBkcolor = this.hexToRGBA(this.darkBkcolor, 0.5);
        this.cardcolor = this.hexToRGBA(this.cardleft, 0.5);
        localStorage.setItem('bodycolor',this.lightBkcolor);
        this.colorService.settbColor(this.customLayout.id.toString(),this.lightBkcolor);
        this.colorService.setcardColor(this.customLayout.id.toString(),this.cardcolor);
        this.changeTheme(this.customLayout.id)
        this.option.forEach((chartOption, index) => {
        switch (this.customLayout.widget[index].type) {

              //piechart
            case "pieChart":
              this.option[index] = {
                title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text: this.customLayout.widget[index].graphSettings.titleText,
                  left: this.customLayout.widget[index].graphSettings.titleAlign,
                  textStyle: {
                    color: themeObject.title.textStyle.color
                  }
                },
                color: themeObject.color,
                tooltip: {
                  show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                  top: '15',
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
                      position: this.customLayout.widget[index].graphSettings.labelPosition
                    },
                    labelLine: {
                      show: this.customLayout.widget[index].graphSettings.labelLineShow
                    },
                    data: this.customLayout.widget[index].actualData.data
                  },
                ],
              };
              break;

              //donutchart
            case "donutChart":
              this.option[index] = {
                title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text: this.customLayout.widget[index].graphSettings.titleText,
                  left: this.customLayout.widget[index].graphSettings.titleAlign,
                  textStyle: {
                    color: themeObject.title.textStyle.color
                  }
                },
                color: themeObject.color,
                tooltip: {
                  show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                  top: '15',
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
                      position: this.customLayout.widget[index].graphSettings.labelPosition
                    },
                    labelLine: {
                      show: this.customLayout.widget[index].graphSettings.labelLineShow
                    },
                    data: this.customLayout.widget[index].actualData.data,
                  }
                ]
              };
              break;

              //funnelchart
            case "funnelChart":
              this.option[index] = {
                title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text: this.customLayout.widget[index].graphSettings.titleText,
                  left: this.customLayout.widget[index].graphSettings.titleAlign,
                  textStyle: {
                    color: themeObject.title.textStyle.color
                  }
                },
                color: themeObject.color,
                tooltip: {
                  show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                  top: '15',
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
                      position: this.customLayout.widget[index].graphSettings.labelPosition
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

              //barchart
            case "barChart":
              this.option[index] = {
                title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text: this.customLayout.widget[index].graphSettings.titleText,
                  left: this.customLayout.widget[index].graphSettings.titleAlign,
                  textStyle: {
                    color: themeObject.title.textStyle.color
                  }
                },
                color: themeObject.color,
                tooltip: {
                  show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                  top: '15',
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
                  type: 'bar',
                  name: this.customLayout.widget[index].graphSettings.legendName,
                  showBackground: true,

                }]
              };
              break;

              //linechart
            case "lineChart":
              this.option[index] = {
                title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text: this.customLayout.widget[index].graphSettings.titleText,
                  left: this.customLayout.widget[index].graphSettings.titleAlign,
                  textStyle: {
                    color: themeObject.title.textStyle.color
                  }
                },
                color: themeObject.color,
                tooltip: {
                  show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                  top: '15',
                  feature: {
                    dataZoom: {
                      show: this.customLayout.widget[index].graphSettings.toolboxZoom,
                      yAxisIndex: '10',
                      realtime: 'true',
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
                  showBackground: true,
                }]
              };
              break;
             
              //gaugechart
              case "gaugeChart":
                this.option[index] = {
                  title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text:this.customLayout.widget[index].graphSettings.titleText,
                  top:-4,
                  textStyle: {
                    color: themeObject.title.textStyle.color
                  },
                  // label: {
                  //   fontSize:'10',
                  // },
                  left:this.customLayout.widget[index].graphSettings.titleAlign
                },
                series: [{
                  top:-10,
                  color: 'rgb(7, 148, 173)',
                  type: 'gauge',
                  progress: {
                      show: true,
                      width: 10
                  },
                  axisLine: {
                      lineStyle: {
                          width: 7,
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
                          borderColor:themeObject.color[0]
                      }
                  },
                  itemStyle:{
                    color:themeObject.color[0]
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
                  data: [{
                    // name:[this.customLayout.widget[index].query.columnName1].toString(),
                    value:[this.customLayout.widget[index]?.actualData?.value]}
                  ]
                }]
                };
                break;
                case "multipleChart":
                  let actualData;
                  actualData = this.customLayout?.widget[index]?.actualData?.data;
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
                        color: themeObject.title.textStyle.color
                      }
                    },
                    color: themeObject.color,                  
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
                    },                   },
                    label: {
                      show: this.customLayout.widget[index].graphSettings.labelShow,
                      position: this.customLayout.widget[index].graphSettings.labelPosition
                    },
                    labelLine: {
                      show: this.customLayout.widget[index].graphSettings.labelLineShow
                    },
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
                            color:themeObject.color[0]
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
                            color:themeObject.color[1]
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
                            color:themeObject.color[2]
                             }
                        },
                        axisLabel: {
                          formatter: '{value}'
                        }
                      }
                    ],
                    series: [
                      {
                        name:this.customLayout.widget[index].graphSettings.legendName,
                        type: 'bar',
                        data: bar1,
                       
                      },
                      {
                        name:this.customLayout.widget[index].graphSettings.legendName2,
                        type: 'bar',
                        yAxisIndex: 1,
                        data: bar2,
                       
                      },
                      {
                        name:this.customLayout.widget[index].graphSettings.legendName3,
                        type: 'line',
                        yAxisIndex: 1,
                        data: line,
                      },
                    ]
                  };
                  break;
                    //candlestick
            case "candleStick":{
              let upColor = '#00da3c';
              let downColor = '#ec0000';
              let actualData;
              actualData = this.customLayout?.widget[index]?.actualData?.data;
              const Date = actualData.map(item => item.Date);
              const Amount = actualData.map(item => item.Amount);
              const High = actualData.map(item => item.High);
              const Close = actualData.map(item => item.Close);
              this.categoryData=Date;
              const Low = actualData.map(item => item.Low);
              const Open = actualData.map(item => item.Open);
              const ProfitLoss = actualData.map(item => item.ProfitLoss);
              for(let i=0;ProfitLoss.length>i;i++){
              if(ProfitLoss[i] == "Loss"){
                downColor = "#ec0000";
              }
              else if(ProfitLoss[i] == "Profit"){
                upColor = "#00da3c";
              }
            }
                let volumes = [];
                 let widget=actualData.map(item=>[item.Open,item.Close,item.Low,item.High,item.Amount])
                 this.candleStickData=widget;    
                 for (let i = 0; i <  this.candleStickData.length; i++) {
                  volumes.push([i, this.candleStickData[i][4], this.candleStickData[i][0] > this.candleStickData[i][1] ? 1 : -1]);
                }             
               // Create an array of OHLC data
            this.option[index]={
              title:{
                show: this.customLayout.widget[index].graphSettings.titleShow,
                text: this.customLayout.widget[index].graphSettings.titleText,
                left: this.customLayout.widget[index].graphSettings.titleAlign,
                textStyle: {
                  color: themeObject.title.textStyle.color
                }
              },
            animation: false,
            legend: {
              data: [this.customLayout.widget[index].graphSettings.legendName],
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
              // extraCssText: 'width: 170px'
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
                height: '52%' // Adjust the height as needed
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
              },
            ],
            dataZoom: [
              {
                type: 'inside',
                start: 0, // Adjust the start value as needed
                end: 100 // Adjust the end value as needed
              },
              {
                show: true,
                type: 'slider',
                top: '90%',
                start: 0, // Adjust the start value as needed
                end: 100 // Adjust the end value as needed
              }
            ],
            series: [
              {
                name: this.customLayout.widget[index].graphSettings.legendName,
                type: 'candlestick',
                data: this.candleStickData,
                itemStyle: {
                  color: upColor,
                  color0: downColor,
                  borderColor: undefined,
                  borderColor0: undefined
                }
              },
              {
                type: 'bar',
                data: volumes,
                name: 'Amount',
                xAxisIndex: 1,
                yAxisIndex: 1
            }]
          }; 
          break;
          }}
        });

      })
      .catch(error => console.error('Error loading theme:', error));
  }
  changeChartColor(){
    this.customLayout.widget[0].graphSettings.headerBg=this.modifiedColors[0];
    this.customLayout.widget[0].graphSettings.bodyBg=this.hexToRGBA(this.modifiedColors[0],0.5);
    this.customLayout.widget[0].graphSettings.bodyColor=this.textColor;
    for(let i=0;i<this.customLayout.widget.length;i++){
    this.customLayout.widget[i].graphSettings.cardColor=this.hexToRGBA(this.modifiedColors[0],0.5);
    this.customLayout.widget[i].graphSettings.borderTopColor=this.modifiedColors[0];
    this.customLayout.widget[i].graphSettings.borderBottomColor=this.modifiedColors[0];
    this.customLayout.widget[i].graphSettings.borderLeftColor=this.modifiedColors[0];
    this.customLayout.widget[i].graphSettings.borderRightColor=this.modifiedColors[0];
    this.customLayout.widget[i].graphSettings.cardTextColor=this.textColor;
    }
    this.option.forEach((chartOption, index) => {
      this.darkBkcolor = this.modifiedColors[0];
      this.cardleft = this.cardright = this.cardtop = this.cardbottom = this.modifiedColors[0];
      this.colorService.setColorArray(this.customLayout.id.toString(),this.modifiedColors);
      this.colorService.setthColor(this.customLayout.id.toString(),this.darkBkcolor);
      this.colorService.setcardlColor(this.customLayout.id.toString(),this.cardleft);
      this.colorService.setcardrColor(this.customLayout.id.toString(),this.cardright);
      this.colorService.setcardtColor(this.customLayout.id.toString(),this.cardtop);
      this.colorService.setcardbColor(this.customLayout.id.toString(),this.cardbottom);
      this.lightBkcolor = this.hexToRGBA(this.modifiedColors[0], 0.5);
      this.cardcolor = this.hexToRGBA(this.modifiedColors[0], 0.5);
      this.colorService.setcardColor(this.customLayout.id.toString(),this.cardcolor);
      this.colorService.settbColor(this.customLayout.id.toString(),this.lightBkcolor);
      this.colorService.setTextColor(this.customLayout.id.toString(),this.textColor);
      this.colorService.setcardTxt(this.customLayout.id.toString(),this.cardtxt)
      this.colorService.setBckColor(this.customLayout.id.toString(),this.backgroundColor);
      switch (this.customLayout.widget[index].type) {
        case "pieChart":
          this.option[index] = {          
            color: this.modifiedColors,
            title: {
              show: this.customLayout.widget[index].graphSettings.titleShow,
              text: this.customLayout.widget[index].graphSettings.titleText,
              left: this.customLayout.widget[index].graphSettings.titleAlign,
              textStyle: {
                color: this.textColor
              }
            },
            tooltip: {
              show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
              top: '15',
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
                  position: this.customLayout.widget[index].graphSettings.labelPosition
                },
                labelLine: {
                  show: this.customLayout.widget[index].graphSettings.labelLineShow
                },
                data: this.customLayout.widget[index].actualData.data
              },
            ],
          };
          break;
          case "donutChart":
            this.option[index] = {
              title: {
                show: this.customLayout.widget[index].graphSettings.titleShow,
                text: this.customLayout.widget[index].graphSettings.titleText,
                left: this.customLayout.widget[index].graphSettings.titleAlign,
                textStyle: {
                  color: this.textColor
                }
              },
              color:this.modifiedColors,
              tooltip: {
                show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                top: '15',
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
                    position: this.customLayout.widget[index].graphSettings.labelPosition
                  },
                  labelLine: {
                    show: this.customLayout.widget[index].graphSettings.labelLineShow
                  },
                  data: this.customLayout.widget[index].actualData.data,
                }
              ]
            };
            break;

            //funnelchart
          case "funnelChart":
            this.option[index] = {
              title: {
                show: this.customLayout.widget[index].graphSettings.titleShow,
                text: this.customLayout.widget[index].graphSettings.titleText,
                left: this.customLayout.widget[index].graphSettings.titleAlign,
                textStyle: {
                  color:this.textColor
                }
              },
              color: this.modifiedColors,
              tooltip: {
                show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                top: '15',
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
                    position: this.customLayout.widget[index].graphSettings.labelPosition
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

            //barchart
          case "barChart":
            this.option[index] = {
              title: {
                show: this.customLayout.widget[index].graphSettings.titleShow,
                text: this.customLayout.widget[index].graphSettings.titleText,
                left: this.customLayout.widget[index].graphSettings.titleAlign,
                textStyle: {
                  color: this.textColor
                }
              },
              color: this.modifiedColors,
              tooltip: {
                show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                top: '15',
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
                type: 'bar',
                name: this.customLayout.widget[index].graphSettings.legendName,
                showBackground: true,

              }]
            };
            break;

            //multipleChart
            case "multipleChart":
              let actualData;
              actualData = this.customLayout?.widget[index]?.actualData?.data;
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
                    color: this.textColor
                  }
                },
                color: this.modifiedColors,                
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
                  feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                  }
                },
                legend: {
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
                        color: this.modifiedColors[0]
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
                        color: this.modifiedColors[1]
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
                        color: this.modifiedColors[2]
                      }
                    },
                    axisLabel: {
                      formatter: '{value}'
                    }
                  }
                ],
                series: [
                  {
                    name:this.customLayout.widget[index].graphSettings.legendName,
                    type: 'bar',
                    data: bar1,
                   
                  },
                  {
                    name:this.customLayout.widget[index].graphSettings.legendName2,
                    type: 'bar',
                    yAxisIndex: 1,
                    data: bar2,
                   
                  },
                  {
                    name:this.customLayout.widget[index].graphSettings.legendName3,
                    type: 'line',
                    yAxisIndex: 1,
                    data: line,
                   
                  },
                ]
              };
              break;

            //candlestick
            case "candleStick":
              let upColor = '#00da3c';
              let downColor = '#ec0000';
              let col
              let actualData1
              actualData1 = this.customLayout?.widget[index]?.actualData?.data;
              const Date = actualData1.map(item => item.Date);
              const Amount = actualData1.map(item => item.Amount);
              const High = actualData1.map(item => item.High);
              const Close = actualData1.map(item => item.Close);
              this.categoryData=Date;
              const Low = actualData1.map(item => item.Low);
              const Open = actualData1.map(item => item.Open);
              const ProfitLoss = actualData1.map(item => item.ProfitLoss);
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
                 let widget=actualData1.map(item=>[item.Open,item.Close,item.Low,item.High,item.Amount])
                 this.candleStickData=widget;    
                 for (let i = 0; i <  this.candleStickData.length; i++) {
                  volumes.push([i, this.candleStickData[i][4], this.candleStickData[i][0] > this.candleStickData[i][1] ? 1 : -1]);
                }      
               // Create an array of OHLC data
            this.option[index]={
              title:{
                show: this.customLayout.widget[index].graphSettings.titleShow,
                text: this.customLayout.widget[index].graphSettings.titleText,
                left: this.customLayout.widget[index].graphSettings.titleAlign,
                textStyle: {
                  color: this.textColor
                }
              },
            animation: false,
            legend: {
              data: [this.customLayout.widget[index].graphSettings.legendName],
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
              // extraCssText: 'width: 170px'
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
                height: '52%' // Adjust the height as needed
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
                min: 'dataMin',
                max: 'dataMax',
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
              },
              {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
              },
            ],
            dataZoom: [
              {
                type: 'inside',
                start: 0, // Adjust the start value as needed
                end: 100 // Adjust the end value as needed
              },
              {
                show: true,
                type: 'slider',
                top: '90%',
                start: 0, // Adjust the start value as needed
                end: 100 // Adjust the end value as needed
              }
            ],
            series: [
              {
                name: this.customLayout.widget[index].graphSettings.legendName,
                type: 'candlestick',
                data: this.candleStickData,
                itemStyle: {
                  color: upColor,
                  color0: downColor,
                  borderColor: undefined,
                  borderColor0: undefined
                }
              },
              {
                type: 'bar',
                data: volumes,
                name: 'Amount',
                xAxisIndex: 1,
                yAxisIndex: 1,
              //   itemStyle: {
              //     color: (params: any) => {
              //       const profitLoss = ProfitLoss[params.dataIndex];
              //       return profitLoss === 'Profit' ? upColor : downColor;
              //     },
              // },
            }]
          }; 
          break;
            //linechart
          case "lineChart":
            this.option[index] = {
              title: {
                show: this.customLayout.widget[index].graphSettings.titleShow,
                text: this.customLayout.widget[index].graphSettings.titleText,
                left: this.customLayout.widget[index].graphSettings.titleAlign,
                textStyle: {
                  color: this.textColor
                }
              },
              color: this.modifiedColors,
              tooltip: {
                show: this.customLayout.widget[index].graphSettings.toolTipShow,
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
                top: '15',
                feature: {
                  dataZoom: {
                    show: this.customLayout.widget[index].graphSettings.toolboxZoom,
                    yAxisIndex: '10',
                    realtime: 'true',
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
                showBackground: true,
              }]
            };
            break;
            case "table":
              this.tableArray = [];
              this.tableData = this.customLayout.widget[index]?.actualData.data;
              this.tableDataIndex[index] = this.tableData
              this.queryText = this.customLayout.widget[index]?.queryText;
              this.totalCount = this.customLayout.widget[index]?.actualData.count;
              this.totalCountIndex[index] = this.totalCount;
              this.queryTextIndex[index] = this.queryText;
              this.queryTextForPage[index] = this.queryTextIndex[index];
              Object.keys(this.tableData[0]).forEach(key => this.tableArray.push(key));
              this.tableArrayIndex[index] = this.tableArray;
              const originalColor = this.modifiedColors[0]; // This is your original color in hex or RGB format
              const colorWithOpacity = this.hexToRGBA(originalColor, 0.5);  // Adds 0.5 as the alpha value
              this.customLayout.widget[index].graphSettings.bodyBg = colorWithOpacity;
              break;
              case "cardChart":
                const cardColor = this.modifiedColors[0]; // This is your original color in hex or RGB format
                const cardColor50 = this.hexToRGBA(cardColor, 0.5);  // Adds 0.5 as the alpha value
                this.customLayout.widget[index].graphSettings.cardColor = cardColor50;
                this.customLayout.widget[index].graphSettings.borderBottomColor = this.modifiedColors[0];
                this.customLayout.widget[index].graphSettings.borderTopColor = this.modifiedColors[0];
                this.customLayout.widget[index].graphSettings.borderLeftColor = this.modifiedColors[0];
                this.customLayout.widget[index].graphSettings.borderRightColor = this.modifiedColors[0];
                this.customLayout.widget[index].graphSettings.cardTextColor = this.textColor;  
                break;    
              case "gaugeChart":
                this.option[index] = {
                  title: {
                  show: this.customLayout.widget[index].graphSettings.titleShow,
                  text:this.customLayout.widget[index].graphSettings.titleText,
                  top:-4,
                  textStyle: {
                    color: this.textColor
                  },
                  // label: {
                  //   fontSize:'10',
                  // },
                  left:this.customLayout.widget[index].graphSettings.titleAlign
                },
                series: [{
                  top:-10,
                  color: 'rgb(7, 148, 173)',
                  type: 'gauge',
                  progress: {
                      show: true,
                      width: 10
                  },
                  axisLine: {
                      lineStyle: {
                          width: 7,
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
                          borderColor:this.modifiedColors[0]
                      }
                  },
                  itemStyle:{
                    color:this.modifiedColors[0]
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
                  data: [{
                    name:[this.customLayout.widget[index].query.columnName1].toString(),
                    value: [this.customLayout.widget[index]?.actualData?.value]
                  }]
                }]
                };
                break;
          };
        })
  }
  removeTheme(){
    this.themeService.setThemeData([])
  }
 
  changeColor(id:any): void {
    this.colorService.setUserColor(id, this.userColor);
  }
  changebckcolor(id:any): void {
    this.colorService.setBckColor(id, this.backgroundColor);
  }
  changetxtColor(id:any):void
{
  this.colorService.setTextColor(id,this.textColor)
}  
changeTheme(id:any):void{
  this.colorService.setColorArray(id,this.colorArray);
}
getuserColor(id) {
    return this.colorService.getUserColor(id);
  }
  getBackgroundStyle() {
    let style: any = {}; // Define an initial empty style object
    if (this.backgroundColor) {
      style['background-color'] = this.backgroundColor;
      style['color'] = this.textColor;
    }
    return style;
  }
  previousBackgroundColor:string;
  previousTextColor:string;
  previouscolorArray:string[];
  // ngDoCheck() {
  //   // Check if the backgroundColor has changed
  //   if (this.backgroundColor !== this.previousBackgroundColor) {
  //     this.changebckcolor(this.customLayout.id);
  //     this.previousBackgroundColor = this.backgroundColor; // Update the previous value
  //   }
  //   if(this.textColor !== this.previousTextColor){
  //     this.changetxtColor(this.customLayout.id);
  //     this.previousTextColor = this.textColor;
  //   }
  // }
  headerBckcolor: string = '';
  headerFontcolor:string='';
  gettheme(id){
    return this.colorService.getColorArray(id);
  }
  getbckColor(id) {
    return this.colorService.getBckColor(id);
  }
  gettextColor(id){
    return this.colorService.getTextColor(id);
  }
}