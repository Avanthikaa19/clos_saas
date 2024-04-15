import { MediaMatcher } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { GridStack } from 'gridstack';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';
import { AUTHENTICATED_USER, JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { SnackbarComponent } from '../../snackbar';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { TemplateMappingComponent } from '../custom-mapping/template-mapping/template-mapping.component';
import { DynamicCaheService } from '../dynamic-cache-service';
import { CustomiseDashboard, SearchScope } from '../models/model';
import { CustomServiceService } from '../service/custom-service.service';
import { ColorPickerDialogComponent } from './color-picker-dialog/color-picker-dialog.component';
import { TextEditorDialogComponent } from './text-editor-dialog/text-editor-dialog.component';
import { FontDialogComponent } from './font-dialog/font-dialog.component';
import { BodyColorPickerComponent } from './body-color-picker/body-color-picker.component';
import { ColorService } from '../color-service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Component({
  selector: 'app-dynamic-landing-page',
  templateUrl: './dynamic-landing-page.component.html',
  styleUrls: ['./dynamic-landing-page.component.scss']
})
export class DynamicLandingPageComponent implements OnInit {

  //Component Height
	component_height!: number;
  storedTheme: any = localStorage.getItem('theme-color');
	@HostListener('window:resize', ['$event'])
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  allTemplate!: CustomiseDashboard[];
  searchscope: SearchScope = new SearchScope(10,'Admin-Users');
  timer:any = null;
  loading: boolean = false;
  keyword: string = '';
  //Pagination
  pageNumber: number = 0;
  totalCount: any;
  totalPages!: number;
  deleteTemplateConfirm: boolean = false;
  deleteId!: number;
  deleting: boolean = false;
  ability:any;
  accessMsg:any;
  editAbility:any;
  downloadAbility:boolean=false;
  editing:boolean=false;
  deletings:boolean=false;
  deleteAbility:any;
  customLayout:CustomiseDashboard=new CustomiseDashboard();
  createdDate=new Date();
  deleteTemplates:boolean=false;
  queryText:any;
  getUserName!: string;
  role: any;
  userData: any;
  userRole!: string;
  createBtn:boolean=false;
  userColor:string;
  currentPage:number=1;
  pageSizeforPagination:any;
	@HostListener('window:resize', ['$event'])
	updateComponentSize(event:any) {
		this.component_height = window.innerHeight - app_header_height;
	}
  	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;
	
  constructor(
    public jwtAuthenicationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private url: UrlService,private colorService: ColorService,
    media: MediaMatcher,
    public router: Router,
    // public crmService: CrmServiceService,
		changeDetectorRef: ChangeDetectorRef,
    // public adminDataService: ServiceService,
    public dynamicCacheSrvice:DynamicCaheService,
    public snackBar: MatSnackBar,
    // public crmService: CrmServiceService,
    public customService: CustomServiceService,
    public datepipe:DatePipe,
    public notifierService:NotifierService,
    private renderer: Renderer2, 
    public encryptDecryptService:EncryptDecryptService ) { 
    this.updateComponentSize(event);
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
    let userName=sessionStorage.getItem(AUTHENTICATED_USER)
    userName=encryptDecryptService.decryptData(userName)    
    if(userName!==null){
      this.getUserName = userName
    }
    const role = sessionStorage.getItem('USER_ROLE');
    if(userName!==null){
      this.role = role
    }
  }

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
    GridStack.init(this.option);
    this.getTemplate();
    this.backgroundImageUrl = localStorage.getItem('backgroundImageUrl');
    this.backgroundColor = localStorage.getItem('backgroundColor');
    this.bodybackgroundColor = localStorage.getItem('bodybackgroundColor');
    this.fontColor = localStorage.getItem('fontColor');
    const savedTitle = localStorage.getItem('dynamicTitle');
    if (savedTitle) {
      this.dynamicTitle = savedTitle;
    }
  }
  shouldShowTooltip = true;

  @ViewChild('nameDisplay') nameDisplay!: ElementRef;

  checkTooltip(name: string) {
    const tempSpan = this.renderer.createElement('span');
    this.renderer.setStyle(tempSpan, 'position', 'absolute');
    this.renderer.setStyle(tempSpan, 'visibility', 'hidden');
    this.renderer.appendChild(tempSpan, this.renderer.createText(name));
    this.renderer.appendChild(this.nameDisplay.nativeElement, tempSpan);

    const elementWidth = tempSpan.offsetWidth;
    this.shouldShowTooltip = elementWidth > 230;

    this.renderer.removeChild(this.nameDisplay.nativeElement, tempSpan);
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
    if (this.pageNumber < totalPages) {
      this.pageNumber++;
    }
  }
  isLastPage(): boolean {
   const totalCount = this.totalCount;
   const pageSize = this.searchscope.pageSize;
 
    const totalPages = Math.ceil(totalCount / pageSize);
    return this.pageNumber+1 === totalPages;
  }

  resetTooltip() {
    this.shouldShowTooltip = false;
  }
    //Grid-Stack Options
    option = {
      cellHeight: '16.8vh',
      verticalMargin: 5,
    // handleClass: 'handle', //To stop draggable
      animate: true,
      // float: true,
      // maxRow: 9,
      autoFit: true,   // just fit based on tallest content.
      autoFitByOverflow: true,    // if you want it to also accommodate the one that overflows the most. Requires previous option.
      alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      resizable: {
          handles: 'se, s, sw, w'
      }
  };
  
  //Theme setting
  setTheme(theme:any) {
    localStorage.setItem('theme-color', theme);
    this.storedTheme = localStorage.getItem('theme-color');
    // this.administratorToolsMainService.storedTheme = this.storedTheme;
  }
  sortReconJobs(){
    let sortedList=this.allTemplate;
    this.allTemplate=sortedList?.slice();
    this.allTemplate?.sort((a,b)=>a.createdDate>b.createdDate?0:1)
   }

  getTemplate(){
    this.loading = true;
    this.customService.getTypesOfTemplate(this.searchscope.pageSize, this.pageNumber+1,this.keyword,'desc','id').subscribe((res)=>{
      this.allTemplate = res['data'];
      this.loading = false;
      this.totalCount = res['count'];
      this.pageSizeforPagination=(this.totalCount/this.searchscope.pageSize)
      this.sortReconJobs();
      for(let i=0;i<this.allTemplate[i]?.widget?.length;i++){
        sessionStorage.setItem('queryText',this.allTemplate[i]?.widget[i]?.queryText)
        }
    },err=>{
      this.loading=false;
      this.createBtn=true;
      this.allTemplate=[]
      console.log(err)
               if(err.error['error']!==null && err.error['error']!==undefined && err.error['status']!==404){
            this.showNotification('error',err.error['error'])
             }  
          else if(err.error['error']!==null && err.error['error']!==undefined && err.error['status']===404){
            this.showNotification('error','No instance available for clos-bi-tool-service')
          } 
    })
  }

  deleteTemplate(){
    this.deleteTemplates = true;
    this.customService.deleteDashboard(this.deleteId).subscribe(
      res =>{
        this.deleteTemplates = false;
        this.pageNumber=0;
        this.getTemplate();
        this.deleteTemplateConfirm = false;         
      }, 
      err =>{ 
        this.deleteTemplates = false;
        this.pageNumber=0;
        this.getTemplate();
        this.deleteTemplateConfirm = false;
      }
    )
    this.openSnackBar('Template Deleted Successfully',null!)
  }
  Id:any;

  goToTemplate(id:any){
    this.Id=id;
    this.loading = true;
    this.customService.getTemplateWithId(id).subscribe(res =>{
      let layout = res;
      this.loading = false;
      for(let i=0;i<layout?.widget?.length;i++){
        sessionStorage.setItem('queryText',layout.widget[i]?.queryText)
        sessionStorage.setItem('indexOfWidget',i?.toString())
        }
      layout.widget.map((element)=>{
        element.actualData = JSON.parse(element.data);
      });
      sessionStorage.setItem('gridlayout',JSON.stringify(res));
      this.router.navigate(['/dynamic/dynamic/new-layout']);
    })
  }

  onKeyup(){
    clearTimeout(this.timer); 
    this.loading=true;
    this.timer = setTimeout(() =>{this.getTemplate()}, 1000)
  }

  getPageSize(){
    this.customService.getPageSize(this.searchscope.tableName).subscribe(
      res => {
        this.searchscope.pageSize = res;
        this.getTemplate();
      }
    )
  }

  //User - Pagination
  onPaginateChange(event:any){
    this.searchscope.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.getTemplate()
  }

  //Dashboard Level Mapping
  dashboardMapping(data:any){
    const dialogRef = this.dialog.open(TemplateMappingComponent, {
      width: '750px',
      height: '350px',
      panelClass: 'dialog-theme-light',
      backdropClass: 'backdropBackground-theme-light',
      hasBackdrop:true,
      data:data
    });
    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });
  }

  //open snack bar
openSnackBar(message: any, action: string) {
	this.snackBar.openFromComponent(SnackbarComponent, {
		panelClass: ['success-snackbar'],duration: 5000,
		data: {
		  message: message, icon: 'done',type:'success'
		}
	  });
}

openErrSnackbar(message:any){
	this.snackBar.openFromComponent(SnackbarComponent, {
		panelClass: ['error-snackbar'],duration: 5000,
		data: {
		  message: message, icon: 'error_outline',type:'error'
		}
	  });
}
showNotification(type: string, message: string) {
  this.notifierService.notify(type, message);
}  

//BI Dynamic header
backgroundColor: string = '';
bodybackgroundColor: string = '';
fontColor:string='';
backgroundImageUrl: string | null = null;
dynamicTitle:string='BI Tools';
handleImageChange(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];
  
  if (file) {
    this.backgroundImageUrl = URL.createObjectURL(file);
    localStorage.setItem('backgroundImageUrl', this.backgroundImageUrl);
  }
}

getBackgroundStyle() {
  let style: any = {}; // Define an initial empty style object
  if (this.backgroundImageUrl) {
    style['background-image'] = `url("${this.backgroundImageUrl}")`;
    style['background-size'] = '100%';
    style['background-repeat'] = 'repeat';
  }

  if (this.backgroundColor) {
    style['background-color'] = this.backgroundColor;
    style['color'] = this.fontColor;
  }

  return style;    
}

openImageUpload() {
  // Trigger the hidden file input element
  const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (inputElement) {
    inputElement.click();
  }
}
openColorPickerDialog() {
  const dialogRef = this.dialog.open(ColorPickerDialogComponent,{
    width:'400px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Set the background color
      this.backgroundColor = result;
      // Store the background color in localStorage
      localStorage.setItem('backgroundColor', this.backgroundColor);

      // Remove the background image
      this.backgroundImageUrl = null;
      // Clear the background image URL from localStorage
      localStorage.removeItem('backgroundImageUrl');
    }
  });
}
openTextEditorDialog() {
  const dialogRef = this.dialog.open(TextEditorDialogComponent, {
    width: '400px', // Set the width of the dialog as needed
    data: {
      editedText: 'Business Intelligence Tool' // Pass the current title to the dialog
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Update the title with the edited text
      this.dynamicTitle = result;
      // You can store this title in a variable or use it as needed in your dashboard
      localStorage.setItem('dynamicTitle', this.dynamicTitle);

    }
  });
}
openFontStyleDialog(){
  const dialogRef = this.dialog.open(FontDialogComponent,{
    width:'400px',
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     this.fontColor=result;
     localStorage.setItem('fontColor', this.fontColor);
    }
  });
}
openbodybgColorPickerDialog() {
  const dialogRef = this.dialog.open(BodyColorPickerComponent,{
    width:'400px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Set the background color
      this.bodybackgroundColor = result;
      // Store the background color in localStorage
      localStorage.setItem('bodybackgroundColor', this.bodybackgroundColor);
    }
  });
}
getUserColor(id:any): any {
  return this.colorService.getUserColor(id);
}
}


