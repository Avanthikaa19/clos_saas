import { ChangeDetectorRef, HostListener, Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';
import { GridStack, GridStackWidget } from 'gridstack';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { CustomServiceService } from '../service/custom-service.service';
import { Router } from '@angular/router';
import { CustomiseDashboard, GridStackElement } from '../models/model';
import { Location } from '@angular/common';
  @Component({
    selector: 'app-custom',
    templateUrl: './custom.component.html',
    styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {

  loading: boolean =  false;
  //Component Height
	component_height: any;
  customLayout =  new CustomiseDashboard();
  layouts: any = [
    {
            "x": "0",
            "y": "0",
            "w": "12",
            "h": "5",
            "layoutId": 1,
            "generalId" : "0",
            "panelName": "Panel 1"
        
        },




    {
      "x": "0",
      "y": "0",
      "w": "6",
      "h": "5",
      "layoutId": 1,
      "generalId" : "1",
      "panelName": "Panel 1"
  
  },
  {
    "x": "7",
    "y": "0",
    "w": "6",
    "h": "5",
    "layoutId": 2,
    "generalId" : "1",
    "panelName": "Panel 2"

},




{
  "x": "0",
  "y": "0",
  "w": "6",
  "h": "3",
  "layoutId": 1,
  "generalId" : "2",
  "panelName": "Panel 1"

},
{
  "x": "7",
  "y": "0",
  "w": "6",
  "h": "3",
  "layoutId": 2,
  "generalId" : "2",
  "panelName": "Panel 2"

},
{
  "x": "0",
  "y": "4",
  "w": "6",
  "h": "2",
  "layoutId": 3,
  "generalId" : "2",
  "panelName": "Panel 3"

},
{
  "x": "7",
  "y": "4",
  "w": "6",
  "h": "2",
  "layoutId": 4,
  "generalId" : "2",
  "panelName": "Panel 4"

},



{
  "x": "0",
  "y": "0",
  "w": "12",
  "h": "2",
  "layoutId": 1,
  "generalId" : "3",
  "panelName": "Panel 1"

},
{
  "x": "0",
  "y": "3",
  "w": "6",
  "h": "3",
  "layoutId": 2,
  "generalId" : "3",
  "panelName": "Panel 2"

},

{
  "x": "7",
  "y": "4",
  "w": "6",
  "h": "1",
  "layoutId": 3,
  "generalId" : "3",
  "panelName": "Panel 3"

},
{
  "x": "6",
  "y": "5",
  "w": "3",
  "h": "2",
  "layoutId": 4,
  "generalId" : "3",
  "panelName": "Panel 4"

},
{
  "x": "9",
  "y": "5",
  "w": "3",
  "h": "2",
  "layoutId": 5,
  "generalId" : "3",
  "panelName": "Panel 5"

},



{
    "x": "0",
    "y": "0",
    "w": "9",
    "h": "3",
    "layoutId": 1,
    "generalId" : "4",
    "panelName": "Panel 1"
  
  },
  {
    "x": "10",
    "y": "0",
    "w": "3",
    "h": "5",
    "layoutId": 2,
    "generalId" : "4",
    "panelName": "Panel 2"
  
  },
  {
    "x": "0",
    "y": "4",
    "w": "3",
    "h": "2",
    "layoutId": 3,
    "generalId" : "4",
    "panelName": "Panel 3"
  
  },
  {
    "x": "3",
    "y": "4",
    "w": "6",
    "h": "2",
    "layoutId": 4,
    "generalId" : "4",
    "panelName": "Panel 4"
  
  },



{
  "x": "0",
  "y": "0",
  "w": "6",
  "h": "1",
  "layoutId": 1,
  "generalId" : "5",
  "panelName": "Panel 1"

},
{
  "x": "6",
  "y": "0",
  "w": "6",
  "h": "1",
  "layoutId": 2,
  "generalId" : "5",
  "panelName": "Panel 2"

},
{
  "x": "0",
  "y": "2",
  "w": "6",
  "h": "1",
  "layoutId": 3,
  "generalId" : "5",
  "panelName": "Panel 3"

},
{
  "x": "6",
  "y": "2",
  "w": "6",
  "h": "1",
  "layoutId": 4,
  "generalId" : "5",
  "panelName": "Panel 4"

},
{
  "x": "0",
  "y": "3",
  "w": "12",
  "h": "3",
  "layoutId": 5,
  "generalId" : "5",
  "panelName": "Panel 5"

},





{
  "x": "0",
  "y": "0",
  "w": "6",
  "h": "1",
  "layoutId": 1,
  "generalId" : "6",
  "panelName": "Panel 1"

},
{
  "x": "6",
  "y": "0",
  "w": "6",
  "h": "1",
  "layoutId": 2,
  "generalId" : "6",
  "panelName": "Panel 2"

},
{
  "x": "0",
  "y": "2",
  "w": "3",
  "h": "1",
  "layoutId": 3,
  "generalId" : "6",
  "panelName": "Panel 3"

},
{
  "x": "6",
  "y": "2",
  "w": "9",
  "h": "1",
  "layoutId": 4,
  "generalId" : "6",
  "panelName": "Panel 4"

},
{
  "x": "0",
  "y": "3",
  "w": "12",
  "h": "3",
  "layoutId": 5,
  "generalId" : "6",
  "panelName": "Panel 5"

},




{
  "x": "0",
  "y": "0",
  "w": "3",
  "h": "2",
  "layoutId": 1,
  "generalId" : "7",
  "panelName": "Panel 1"

},
{
  "x": "3",
  "y": "0",
  "w": "6",
  "h": "2",
  "layoutId": 2,
  "generalId" : "7",
  "panelName": "Panel 2"

},
{
  "x": "10",
  "y": "0",
  "w": "3",
  "h": "4",
  "layoutId": 3,
  "generalId" : "7",
  "panelName": "Panel 3"

},
{
  "x": "0",
  "y": "2",
  "w": "3",
  "h": "2",
  "layoutId": 4,
  "generalId" : "7",
  "panelName": "Panel 4"

},
{
  "x": "3",
  "y": "2",
  "w": "6",
  "h": "2",
  "layoutId": 5,
  "generalId" : "7",
  "panelName": "Panel 5"

},
{
  "x": "0",
  "y": "4",
  "w": "12",
  "h": "1",
  "layoutId": 6,
  "generalId" : "7",
  "panelName": "Panel 6"

},



{
  "x": "0",
  "y": "0",
  "w": "3",
  "h": "2",
  "layoutId": 1,
  "generalId" : "8",
  "panelName": "Panel 1"

},
{
  "x": "3",
  "y": "0",
  "w": "6",
  "h": "2",
  "layoutId": 2,
  "generalId" : "8",
  "panelName": "Panel 2"

},
{
  "x": "10",
  "y": "0",
  "w": "3",
  "h": "2",
  "layoutId": 3,
  "generalId" : "8",
  "panelName": "Panel 3"

},
{
  "x": "0",
  "y": "3",
  "w": "3",
  "h": "3",
  "layoutId": 4,
  "generalId" : "8",
  "panelName": "Panel 4"

},
{
  "x": "3",
  "y": "3",
  "w": "6",
  "h": "3",
  "layoutId": 5,
  "generalId" : "8",
  "panelName": "Panel 5"

},
{
  "x": "10",
  "y": "3",
  "w": "3",
  "h": "3",
  "layoutId": 6,
  "generalId" : "8",
  "panelName": "Panel 6"

},
]
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight - app_header_height;
	}
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;
  constructor(
    // public jwtAuthenicationService: JwtAuthenticationService,
    public dialog: MatDialog,
    private url: UrlService,
    public router: Router,
    media: MediaMatcher,
    // public crmService: CrmServiceService,
		changeDetectorRef: ChangeDetectorRef,
    // public adminDataService: ServiceService,
    public customService : CustomServiceService,
    private location: Location,
  ) { 
    this.updateComponentSize();
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
  }

  public updateUrl(): Promise < any > {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    this.bodybackgroundColor = localStorage.getItem('bodybackgroundColor');
    this.backgroundColor = localStorage.getItem('backgroundColor');
    this.fontColor = localStorage.getItem('fontColor');
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    sessionStorage.setItem('id',this.layouts.layoutId)
    // this.getLayouts();
  }
  ability:any;
  accessMsg:any;
  editAbility:any;
  downloadAbility:boolean=false;
  editing:boolean=false;
  deleting:boolean=false;
  deleteAbility:any;
  disableClick:boolean=false;

  // getLayouts(){
  //   this.loading = true;
  //   console.log(this.layouts)
  //   this.customService.getLayouts(this.layouts).subscribe(
  //     res => {
  //       console.log(res)
  //     }
  //   )

  // }

  openNewDashboard(e:any){
    this.loading = true;
    this.customService.gridLayout(e).subscribe(
      res => {
        this.customLayout.layout = res;
        let len=this.customLayout.layout.length.toString()
        sessionStorage.setItem('id',len)
        sessionStorage.setItem('gridlayout',JSON.stringify(this.customLayout));
        this.router.navigate(['/dynamic/dynamic/new-layout']);
        this.loading = false;
      }
    );
  }
  goBack() {
    this.location.back();
  }
  bodybackgroundColor: string = '';
  backgroundColor: string = '';
  fontColor:string='';
}
