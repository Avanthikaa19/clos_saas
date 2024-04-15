import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ActivePanelPath } from 'src/app/loan-case-manager/components/case-manager-main/Navigation';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  navigationElements: SideNav[] = [
    {
      navName: "Currency Configuration",
      navIcon: "attach_money",
      routerLink: "/main-nav/currency-config",
      selectedNav: false,
    },
    {
      navName: "Duplicate Check Rules",
      navIcon: "content_copy",
      routerLink: "/main-nav/duplicate-check-config",
      selectedNav: false,
    },
    {
      navName: "Loan Type",
      navIcon: "business",
      routerLink: "/main-nav/loan-type-config",
      selectedNav: false,
    },
    {
      navName: "Collateral Config",
      navIcon: "card_travel",
      routerLink: "/main-nav/collateral-config",
      selectedNav: false,
    },
    {
      navName: "User Defined Fields",
      navIcon: "list_alt",
      routerLink: "/main-nav/user-defined-fields",
      selectedNav: false,
    },
    // {
    //   navName: "Applications",
    //   navIcon: "description",
    //   routerLink: "application-list",
    //   selectedNav: false,
    // }, 
    // {
    //   navName: "Configuration",
    //   navIcon: "settings_suggest",
    //   routerLink: "",
    //   selectedNav: false,
    //   subNav: [
    //     // {
    //     //   navName: "Score Limit",
    //     //   navIcon: "credit_score",
    //     //   routerLink: "score-limit-config",
    //     //   selectedNav: false,
    //     // },
    //     {
    //       navName: "Duplicate Check Rules",
    //       navIcon: "file_copy",
    //       routerLink: "duplicate-check-config",
    //       selectedNav: false,
    //     },
    //     // {
    //     //   navName: "Algorithms",
    //     //   navIcon: "tips_and_updates",
    //     //   routerLink: "algorithm-config",
    //     //   selectedNav: false,
    //     // },
    //     // {
    //     //   navName: "Application Scoring",
    //     //   navIcon: "assignment",
    //     //   routerLink: "application-list",
    //     //   selectedNav: false,
    //     // }
    //   ]
    // },
    // {
    //   navName: "Settings",
    //   navIcon: "settings",
    //   routerLink: "",
    //   selectedNav: false,
    //   subNav: [
    // {
    //   navName: "Table",
    //   navIcon: "backup_table",
    //   routerLink: "general-table",
    //   selectedNav: false,
    // },
    // {
    //   navName: "Filter",
    //   navIcon: "filter_list",
    //   routerLink: "generic-compo",
    //   selectedNav: false,
    // },
    // {
    //   navName: "Application Scoring",
    //   navIcon: "assignment",
    //   routerLink: "application-list",
    //   selectedNav: false,
    // },
    // ]
    // }
  ];

  currentURL: string = "";
  currentPanel: string = "";
  selectedNav: string = "";
  breadCrumbList: any[] = [];
  activePathList: ActivePanelPath[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentURL = this.router.url;
  }

  ngOnInit(): void {
    this.currentPanel = this.getCurrentPathNameForBreadCrumbs(this.router.url);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentPanel = this.getCurrentPathNameForBreadCrumbs(e.url);
      }
    });
  }

  onNavClick(navElement: SideNav) {
    let url = this.currentURL;
    url = url.substring(0, url.lastIndexOf("/main-nav"));
    this.router.navigateByUrl(url + navElement.routerLink);
    this.currentPanel = this.getCurrentPathNameForBreadCrumbs(this.router.url);
    //console.log(this.currentPanel)
    //this.moduleSelection(navElement);
  }

  moduleSelection(navElement: SideNav) {
    console.log("Nav Element", navElement);
  }

  // getCurrentPathName(path: string) {
  //   if (path.endsWith('/application-list')) {
  //     return "Doc Preview"
  //   }
  //   else if(path.endsWith('/score-limit-config')){
  //     return "Score Limit"
  //   }
  //   else if(path.endsWith('/duplicate-check-config')){
  //     return "Duplicate Check Rules"
  //   }
  //   else if(path.endsWith('/algorithm-config')){
  //     return "Algorithms"
  //   }
  //   else if(path.endsWith('/general-table')){
  //     return "Table"
  //   }
  //   return path;
  // }

  // INITIAL DECLARATION OF BREADCRUMBS
  declareInitialPaths() {
    this.activePathList = [
      // CONFIGURATIONS BREADCRUMBS
      { path: '/loan-application-matching/main-nav/currency-config', activePanel: 'Currency Configuration', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Currency Configuration', url: ['loan-application-matching', 'main-nav', 'currency-config'] }] },
      { path: '/loan-application-matching/main-nav/duplicate-check-config', activePanel: 'Duplicate Check Rules', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Configuration', url: ['loan-application-matching', 'main-nav', 'duplicate-check-config'] }, { name: 'Duplicate Check Rules', url: ['loan-application-matching', 'main-nav', 'duplicate-check-config'] }] },
      { path: '/loan-application-matching/main-nav/loan-type-config', activePanel: 'Loan Type', breadCrumbs: [{ name: 'Home', url: ['home'] },  { name: 'Loan Type', url: ['loan-application-matching', 'main-nav', 'loan-type-config'] }] },
      { path: '/loan-application-matching/main-nav/collateral-config', activePanel: 'Collateral Config', breadCrumbs: [{ name: 'Home', url: ['home'] },  { name: 'Collateral', url: ['loan-application-matching', 'main-nav', 'loan-type-config'] }] },
      { path: '/loan-application-matching/main-nav/user-defined-fields', activePanel: 'User Defined Fields', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'User Defined Fields', url: ['loan-application-matching', 'main-nav', 'user-defined-fields'] }] },
    ]
  }

  // TO GET ACTIVE PATH BREADCRUMB AND ACTIVEPANEL
  getCurrentPathNameForBreadCrumbs(path: string) {
    this.declareInitialPaths()
    for (let i = 0; i < this.activePathList.length; i++) {
      if (path.endsWith(this.activePathList[i].path)) {
        this.breadCrumbList = this.activePathList[i].breadCrumbs;
        return this.activePathList[i].activePanel
      }
    }
    return path;
  }

  // CLICKING BREACRUMBS -> NAVIGATE TO THAT PAGE
  navToUrl(link: any[]) {
    this.router.navigate(link)
  }

}

export class SideNav {
  navName: string;
  navIcon: string;
  selectedNav?: boolean;
  activeOnPanels?: string[];
  routerLink?: string;
  subNav?: SideNav[];
  isExpanded?: boolean;
}
