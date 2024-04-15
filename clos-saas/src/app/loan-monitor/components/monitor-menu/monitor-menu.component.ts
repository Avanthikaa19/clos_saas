import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ActivePanelPath } from 'src/app/loan-case-manager/components/case-manager-main/Navigation';

@Component({
  selector: 'app-monitor-menu',
  templateUrl: './monitor-menu.component.html',
  styleUrls: ['./monitor-menu.component.scss']
})
export class MonitorMenuComponent implements OnInit {

  navigationElements: SideNav[] = [
    {
      navName: 'Data Monitoring',
      navIcon: 'monitor',
      routerLink: 'data-monitoring',
      selectedNav: true
    },
    {
      navName: 'Log Monitoring',
      navIcon: "list_alt",
      routerLink: 'file-editor',
      selectedNav: true
    },
    {
      navName: 'House Keeping',
      navIcon: "clear_all",
      routerLink: 'house-keeping',
      selectedNav: true
    },
    {
      navName: 'Application Core',
      navIcon: "settings",
      routerLink: 'application-core',
      selectedNav: true
    },
  ];

  currentURL: string = "";
  currentPanel: string = "...";
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
    url = url.substring(0, url.lastIndexOf("/"));
    this.router.navigateByUrl(url + "/" + navElement.routerLink);
    this.currentPanel = this.getCurrentPathNameForBreadCrumbs(this.router.url);
    // this.moduleSelection(navElement);
  }

  moduleSelection(navElement: SideNav) {
    console.log("Nav Element", navElement);
  }

  // getCurrentPathName(path: string) {
  //   if (path.endsWith('/applicant-details')) {
  //     return "Applicant Details"
  //   }
  //   return path;
  // }

  // INITIAL DECLARATION OF BREADCRUMBS
  declareInitialPaths() {
    this.activePathList = [
      // CONFIGURATIONS BREADCRUMBS
      { path: '/loan-monitor/data-monitoring', activePanel: 'Data Monitoring', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Data Monitoring', url: ['loan-monitor', 'data-monitoring'] }] },
      { path: '/loan-monitor/file-editor', activePanel: 'Log Monitoring', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Log Monitoring', url: ['loan-monitor', 'file-editor'] }] },
      { path: '/loan-monitor/house-keeping', activePanel: 'House Keeping', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'House Keeping', url: ['loan-monitor', 'house-keeping'] }] },
      { path: '/loan-monitor/application-core', activePanel: 'Application Core', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Application Core', url: ['loan-monitor', 'application-core'] }] },
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
  navToUrl(link: any) {
    if (!link.isNav) {
      this.router.navigate(link.url)
    }
  }

}

export class SideNav {
  navName: string;
  navIcon: string;
  selectedNav?: boolean;
  activeOnPanels?: string[];
  routerLink?: string;
  subNav?: SideNav[];
}

