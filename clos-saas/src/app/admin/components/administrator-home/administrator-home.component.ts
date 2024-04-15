import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessControlData } from 'src/app/app.access';
import { SearchScope } from 'src/app/dynamic-dashboard/dynamic-dashboard/models/model';
import { CustomServiceService } from 'src/app/dynamic-dashboard/dynamic-dashboard/service/custom-service.service';
import { SideNav } from 'src/app/loan-application/components/main-nav/main-nav.component';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';

@Component({
  selector: 'app-administrator-home',
  templateUrl: './administrator-home.component.html',
  styleUrls: ['./administrator-home.component.scss']
})
export class AdministratorHomeComponent implements OnInit {

//   isExpanded = false;
  breadCrumbList: any[] = []
//   panelState = false;
//   panelOpenState = false;
//   currentPanel: string = '...';
//   currentUrl: any;
//   routeSub: Subscription;
//   selectedPanel: string = 'User Admin Dashboard';
//   sideNav: Navigation[] = [
//     { name: "Admin Dashboard", iconName: "dashboard", routerLink: "dashboard", activeOnPanels: ["User Admin Dashboard"], disabled: false, access: this.ac?.items.AD001C_DASHBOARD_HAS_ACCESS},
//     { name: "Manage Users", iconName: "manage_accounts", routerLink: "users",activeOnPanels: ["Manage Users"],disabled: false, access: this.ac?.items.AD002G_USERS_HAS_ACCESS},
//     { name: "Manage Roles", iconName: "badge", routerLink: "roles",activeOnPanels: ["Manage Roles"],disabled: false, access: this.ac?.items.AD004G_ROLES_HAS_ACCESS },
//     { name: "Manage Access Template", iconName: "security", routerLink: "access-template",activeOnPanels: ["Access Template"],disabled: false, access: this.ac?.items.AD005G_ACCESS_TEMPLATE_HAS_ACCESS},
//     // { name: "Manage Groups", iconName: "supervised_user_circle", routerLink: "groups",activeOnPanels: ["Manage Groups"],disabled: false, access: this.ac?.items.AD003G_GROUPS_HAS_ACCESS },
//    { name: "Audit Trail", iconName: "assignment_ind", routerLink: "audit",activeOnPanels: ["Audit"],disabled: false, access: this.ac?.items.AD006C_AUDIT_TRAIL_HAS_ACCESS},
//    { name: "ITAM Reports", iconName: "assignment", routerLink: "audit-reports", activeOnPanels: ["ITAM Reports"], disabled: false, access: this.ac?.items.AD006E_ITAM_REPORTS},
//     // { name: "Password Encoder", iconName: "lock", routerLink: "password-encoder", activeOnPanels: ["Password Encoder"],disabled: false, access: this.ac?.items.AD006E_ITAM_REPORTS},


//   ]

//   count: Count[] = [
//     { "name": "Alerts Created", "count": 30 },
//     { "name": "Risk Scenarious Configured", "count": 13 },
//     { "name": "Alerts Outstanding", "count": 21 },
//     { "name": "Alerts Pending For > 7 Days", "count": 4 },
//     { "name": "Trades in Pending Alerts", "count": 120 },
//   ]

//   constructor(
//     public router: Router,
//     public ac: AccessControlData,
//   ) { }

//   ngOnInit(): void {
//    this.currentPanel = this.getCurrentPathName(this.router.url);
//     console.log(this.currentPanel,'current name path')
//     this.router.events.subscribe((e) => {
//       if (e instanceof NavigationEnd) {
//         this.currentPanel = this.getCurrentPathName(e.url);
//         console.log(this.currentPanel,'current name path1')
//       }
//     });
//   }

//   onPanelClick(panelName: string){
//     this.selectedPanel = panelName;
//   }

//   getRouterLink(routerLink){
//     if(routerLink == "change-approval"){
//       console.log(routerLink);
//     }
//     return routerLink;
//   }
//   getCurrentPathName(path: string) {
//     if (path.endsWith('dashboard')){
//       this.breadCrumbList = [ {name: 'User Admin Dashboard', url:['admin','admin','dashboard']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('users')){
//       this.breadCrumbList = [{name:'Manage Users', url:['admin','admin','users']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('users/user-detail')){
//       this.breadCrumbList = [{name:'Manage Users', url:['admin','admin','users']},{name: 'Details' , url:['admin','admin','users','user-detail']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('groups')){
//       this.breadCrumbList = [{name:'Manage Groups', url:['admin','admin','groups']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('groups/group-detail')){
//       this.breadCrumbList = [{name:'Manage Groups', url:['admin','admin','groups']},{name: 'Details' , url:['admin','admin','groups','group-detail']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('roles')){
//       this.breadCrumbList = [ {name:'Manage Roles', url:['admin','admin','roles']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('roles/role-detail')){
//       this.breadCrumbList = [ {name:'Manage Roles', url:['admin','admin','roles']},{name: 'Details' , url:['admin','admin','roles','role-detail']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('access-template')){
//       this.breadCrumbList = [ {name:'Access Template', url:['admin','admin','access-template']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('access-template/access-detail')){
//       this.breadCrumbList = [ {name:'Access Template', url:['admin','admin','access-template']},{name: 'Details' , url:['admin','admin','access-template','access-detail']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('change-approval')){
//       this.breadCrumbList = [{name:'Changes Approval', url:['admin','admin','change-approval']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('audit-trail')){
//       this.breadCrumbList = [{name:'Audit Trail', url:['admin','admin','audit-trail']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('password-encoder')){
//       this.breadCrumbList = [{name:'Password Encoder', url:['admin','admin','password-encoder']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('audit-reports')){
//       this.breadCrumbList = [{name:'ITAM Reports', url:['admin','admin','audit-reports']}]
//       return "Administrator";
//     }
//     else if (path.endsWith('audit')){
//       this.breadCrumbList = [{name:'Audit', url:['admin','admin','audit']}]
//       return "Administrator";
//     }
//     console.log("route list", this.breadCrumbList)
//     return path
//   }
//   navToUrl(link: any[]) {
//     // console.log("route",link)
//     this.router.navigate(link)
//   }
// }


sideNavigationList: Navigation[] = [
  { name: "Manage Users", iconName: "supervised_user_circle", routerLink: "users", activeOnPanels: ["Application Entry"], disabled: false, access: '' },
  { name: "Manage Groups", iconName: "settings_suggest", routerLink: "groups", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  { name: "Manage Roles", iconName: "manage_accounts", routerLink: "roles", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  { name: "Manage Access Template", iconName:"security", routerLink: "access-template", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  { name: "Audit Trail", iconName:"art_track", routerLink: "auditTrailListing", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  { name: "Demo Videos", iconName:"important_devices", routerLink: "demo", activeOnPanels: ["Application Details"], disabled: false, access: '' },
  { name: "Subscriptions and Billings", iconName:"money", routerLink: "subscribe", activeOnPanels: ["Application Entry"], disabled: false, access: '' },
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
currentURL: string = "";
currentPanel: string = "...";
selectedNav: string = "";
activeNavItem:string='';
getUserName:any='';
searchscope:SearchScope=new SearchScope(10,'clos')
pageNumber:number=0;
allTemplate:any=[];
totalCount:number;
screens:any=[];
keyword:any='';
screenList:any=[];
dashList: boolean = false;
  listOpen:boolean = false;
  dashName:string='';


constructor(
  private route: ActivatedRoute,
  public router: Router,
  public customService:CustomServiceService,
  public encryptDecryptService:EncryptDecryptService,
) {
  this.currentURL = this.router.url;
}

ngOnInit(): void {
  console.log('path',this.getCurrentPathName(this.router.url))
  this.currentPanel = this.getCurrentPathName(this.router.url);
  this.router.events.subscribe((e) => {
    if (e instanceof NavigationEnd) {
      this.currentPanel = this.getCurrentPathName(e.url);
    }
  });
  console.log(this.currentPanel)
  this.getScreen()
}
getScreen(){
  this.customService.getScreen().subscribe(res=>{
    this.screenList = res;
    })
}

onNavClick(navElement: Navigation) {
  let url = this.currentURL;
  url = url.substring(0, url.lastIndexOf("/"));
  this.router.navigateByUrl(url + "/" + navElement.routerLink);
  this.currentPanel = this.getCurrentPathName(this.router.url);
  console.log(this.currentPanel);
  console.log(url,'url')
}

moduleSelection(navElement: SideNav){
  console.log("Nav Element", navElement);
}


getCurrentPathName(path: string) {
    if (path.endsWith('dashboard')){
      this.breadCrumbList = [ {name: 'User Admin Dashboard', url:['admin','admin','dashboard']}]
      return "Administrator";
    }
    else if (path.endsWith('users')){
      this.breadCrumbList = [{name:'Manage Users', url:['admin','admin','users']}]
      return "Manage Users";
    }
    else if (path.endsWith('users/user-detail')){
      this.breadCrumbList = [{name:'Manage Users', url:['admin','admin','users']},{name: 'Details' , url:['admin','admin','users','user-detail']}]
      return "Manage Users";
    }
    else if (path.endsWith('groups')){
      this.breadCrumbList = [{name:'Manage Groups', url:['admin','admin','groups']}]
      return "Manage Groups";
    }
    else if (path.endsWith('groups/group-detail')){
      this.breadCrumbList = [{name:'Manage Groups', url:['admin','admin','groups']},{name: 'Details' , url:['admin','admin','groups','group-detail']}]
      return "Manage Groups";
    }

    else if (path.endsWith('roles')){
      this.breadCrumbList = [ {name:'Manage Roles', url:['admin','admin','roles']}]
      return "Manage Roles";
    }
    else if (path.endsWith('roles/role-detail')){
      this.breadCrumbList = [ {name:'Manage Roles', url:['admin','admin','roles']},{name: 'Details' , url:['admin','admin','roles','role-detail']}]
      return "Manage Roles";
    }
    else if (path.endsWith('access-template')){
      this.breadCrumbList = [ {name:'Access Template', url:['admin','admin','access-template']}]
      return "Manage Access Template";
    }
    else if (path.endsWith('auditTrailListing')){
      this.breadCrumbList = [ {name:'Audit Trail', url:['admin','admin','auditTrailListing']}]
      return "Audit Trail";
    }
    else if (path.endsWith('')){
      this.breadCrumbList = [ {name:'Access Template', url:['admin','admin','access-template']},{name: 'Details' , url:['admin','admin','access-template','access-detail']}]
      return "Manage Access Template";
    }

    else if (path.endsWith('audit')){
      this.breadCrumbList = [{name:'Audit Trail', url:['admin','admin','audit']}]
      return "Administrator";
    }

    else if (path.endsWith('audit-reports')){
      this.breadCrumbList = [{name:'ITAM Reports', url:['admin','admin','audit-reports']}]
      return "Administrator";
    }

    else if (path.endsWith('subscribe')){
      this.breadCrumbList = [{name:'Subscriptions and Billings', url:['admin','admin','subscribe']}]
      return "Subscriptions and Billings";
    }
    else if (path.endsWith('demo')){
      this.breadCrumbList = [{name:'Demo Videos', url:['admin','admin','demo']}]
      return "Demo Videos";
    }

    console.log("route list", path)
    return path
  }
  navToUrl(link: any[]) {
    // console.log("route",link)
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
		  let data=res['result']
		  this.totalCount=res['count']
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

export class Count {
  name: string;
  count: number;
}