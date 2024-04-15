import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchScope } from 'src/app/dynamic-dashboard/dynamic-dashboard/models/model';
import { CustomServiceService } from 'src/app/dynamic-dashboard/dynamic-dashboard/service/custom-service.service';
import { SideNav } from 'src/app/loan-application/components/main-nav/main-nav.component';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER, JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';

@Component({
  selector: 'app-application-main',
  templateUrl: './application-main.component.html',
  styleUrls: ['./application-main.component.scss']
})
export class ApplicationMainComponent implements OnInit {
  breadCrumbList: any[] = []
  currentURL:string = '';
  dashList: boolean = false;
  listOpen:boolean = false;
  dashName:string='';
  currentPanel: string = "...";
  getUserName:any='';
  searchscope:SearchScope=new SearchScope(10,'clos')
  pageNumber:number=0;
  allTemplate:any=[];
  totalCount:number;
  screens:any=[];
  keyword:any='';
  screenList:any=[];
  sideNavigationList: Navigation[] = [
    { name: "Application Entry", iconName: "assignment", routerLink: "application-details", activeOnPanels: ["Application Entry"], disabled: false, access: '' },
    { name: "Application View", iconName: "preview", routerLink: "application-view", activeOnPanels: ["Application Details"], disabled: false, access: '' },
    { name: "Rollover Application", iconName: "refresh", routerLink: "rollover-listing", activeOnPanels: ["Application Details"], disabled: false, access: '' },
    { name: "Extension Of Loan", iconName: "extension", routerLink: "extension-of-loan", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  ]
navigationElements: SideNav[] = [
  {
    navName: "Dashboards",
    navIcon: "dashboard",
    routerLink: "",
    selectedNav: false,
    isExpanded:false,
    subNav: [
      {
        navName: "Application Verification",
        navIcon: "how_to_reg",
        routerLink: "application-verification",
        selectedNav: true,
      },
      {
        navName: "Underwriting",
        navIcon: "description",
        routerLink: "underwriting",
        selectedNav: true,
      },
      {
        navName: "Loan Approval",
        navIcon: "thumb_up_alt",
        routerLink: "loan-approval",
        selectedNav: true,
      },
      // {
      //   navName: "Document Verification",
      //   navIcon: "assignment_turned_in",
      //   routerLink: "document-verification",
      //   selectedNav: true,
      // },
    ]
  }  
]
  constructor(
    public router: Router,
    public encryptDecryptService:EncryptDecryptService,
    public customService:CustomServiceService,) {
    this.currentURL = this.router.url;
   }

  ngOnInit(): void {
    this.currentPanel = this.getCurrentPathName(this.router.url);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentPanel = this.getCurrentPathName(e.url);
      }
    });
    this.getScreen();
  }
  getScreen(){
		this.customService.getScreen().subscribe(res=>{
			this.screenList = res;
		  })
	}

  onNavClick(navElement: Navigation) {
    sessionStorage.removeItem('appId')
    let url = this.currentURL;
    url = url.substring(0, url.lastIndexOf("/"));
    this.router.navigateByUrl(url + "/" + navElement.routerLink);
    this.currentPanel = this.getCurrentPathName(this.currentURL);
  }

  getCurrentPathName(path: string) {
  if (path.endsWith('application-details')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] },{ name: 'Applicant Details', url: ['application-entry', 'application-details'] }]
      return "Application Entry";
    }
    else if (path.endsWith('corporate-details')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Corporate Details', url: ['application-entry', 'corporate-details'] }]
      return "Application Entry";
    }
    else if (path.endsWith('loan-details')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Loan Details', url: ['application-entry', 'loan-details'] }]
      return "Application Entry";
    }
    else if (path.endsWith('collateral-details')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Collateral Details', url: ['application-entry', 'collateral-details'] }]
      return "Application Entry";
    }
    else if (path.endsWith('risk&compliance-details')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Risk and Compailance', url: ['application-entry', 'risk&compliance-details'] }]
      return "Application Entry";
    }
    else if (path.endsWith('reference-details')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Reference', url: ['application-entry', 'reference-details'] }]
      return "Application Entry";
    }
    else if (path.endsWith('uploads')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Upload', url: ['application-entry', 'uploads'] }]
      return "Application Entry";
    }
    else if (path.endsWith('application-view')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Application View', url: ['application-entry', 'application-view'] }]
      return "Application View";
    }
    else if (path.endsWith('dashboard-mapping')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Dashboard Mapping', url: ['application-entry', 'dashboard-mapping'] }]
      return "Dashboard Mapping";
    }
    else if (path.endsWith('rollover-listing')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Rollover Application', url: ['application-entry', 'rollover-listing'] }]
      return "Rollover Application";
    }
    else if (path.endsWith('extension-of-loan')) {
      this.breadCrumbList = [{ name: 'Home', url: ['home'] }, { name: 'Extension Of Loan', url: ['application-entry', 'extension-of-loan'] }]
      return "Extension Of Loan";
    }
    return path
  }
  
  navToUrl(link: any[]) {
    this.router.navigate(link)
  }  

  openDashboard(name){
    this.listOpen=!this.listOpen ;
		this.dashList = true;
    this.dashName=name;
    this.getTemplate();
  }
  getMapping(name){
		sessionStorage.setItem('dashName',name);
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
      this.getUserName=this.encryptDecryptService.decryptData(user);
		this.customService.getMapping(name, this.getUserName,this.pageNumber,this.searchscope.pageSize,'').subscribe(res=>{
		//   this.allTemplate = res['result'];
		  let data=res['result']
		  this.totalCount=res['count']
		  this.screens = [];
      this.allTemplate=[];
		  this.allTemplate?.forEach(e => {
			this.screens?.push(e.selectedScreen);
		  })
		  data?.forEach(e=>{
			  this.allTemplate?.push(e)
		  })
		})
	  }
	  Id:any;
	
	viewDashboard(id){
	  this.Id=id;
      this.customService.getTemplateWithId(id).subscribe(res =>{
      let layout = res;
      layout.widget.map((element)=>{
        element.actualData = JSON.parse(element.data);
      });
      sessionStorage.setItem('gridlayout',JSON.stringify(res));
	//   window.location.reload();
      this.navToUrl(['/dynamic/dynamic/dashboardMapping']);
    })
	}

	getTemplate(){
		this.customService.getTypesOfTemplate(this.searchscope.pageSize, this.pageNumber,this.keyword,'desc','id').subscribe(res=>{
		  this.allTemplate = res['data'];
		  this.totalCount = res['count'];
		})
    this.viewDashboard(this.Id)
	  }
}

export class Navigation {
  name: string;
  iconName: string;
  routerLink: string;
  children?: Navigation[];
  activeOnPanels: string[];
  disabled: boolean;
  access: string;
}
