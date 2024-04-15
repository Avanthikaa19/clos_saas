import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ActivePanelPath } from 'src/app/loan-case-manager/components/case-manager-main/Navigation';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { DataEntrySharedService } from '../../data-entry-shared.service';

@Component({
  selector: 'app-data-entry-home',
  templateUrl: './data-entry-home.component.html',
  styleUrls: ['./data-entry-home.component.scss']
})
export class DataEntryHomeComponent implements OnInit {

  private subscription: Subscription;
  activeStepIndex: number;
  lastRouteSegment: string;
  getFld: any;
  currentPage: string = ''
  fieldsName: any = {}
  listFieldName: ColumnList = new ColumnList();
  breadCrumbList: any[] = [];
  activePathList: ActivePanelPath[] = [];
  navigationElements: SideNav[] = [

    {
      navName: "Credit Card Application",
      navIcon: "credit_card",
      routerLink: "",
      selectedNav: false,
      subNav: [

        {
          navName: "Data Entry",
          navIcon: "assignment",
          routerLink: "",
          selectedNav: true,
        },
        // {
        //   navName: "View Applications(Old)",
        //   navIcon: "remove_red_eye",
        //   routerLink: "view-application-old",
        //   selectedNav: true,
        // },
        {
          navName: "View Applications",
          navIcon: "remove_red_eye",
          routerLink: "view-application",
          selectedNav: true,
        },
      ]
    },
    {
      navName: "External System",
      navIcon: "settings_system_daydream",
      routerLink: "",
      selectedNav: false,
      subNav: [

        {
          navName: "NFIS",
          navIcon: "view_list",
          routerLink: "nfis-list",
          selectedNav: true,
        },
        {
          navName: "TU",
          navIcon: "view_list",
          routerLink: "",
          selectedNav: true,
        },
      ]
    },
    {
      navName: "Import/Export",
      navIcon: "import_export",
      routerLink: "",
      selectedNav: false,
      subNav: [

        {
          navName: "Import",
          navIcon: "upload_file",
          routerLink: "import",
          selectedNav: true,
        },
        {
          navName: "Export",
          navIcon: "download",
          routerLink: "export",
          selectedNav: true,
        },
      ]
    }
  ];

  currentURL: string = "";
  currentPanel: string = "...";
  selectedNav: string = "";

  constructor(

    private loanService: LoanServiceService,
    private router: Router,
    private dataEntrySharedService: DataEntrySharedService
  ) {
    this.currentURL = this.router.url;
  }

  ngOnInit(): void {
    this.getFieldNames();
    this.subscription = interval(200).subscribe(() => {
      this.sideNavGetData()
    });
    this.currentPanel = this.getCurrentPathNameForBreadCrumbs(this.router.url);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentPanel = this.getCurrentPathNameForBreadCrumbs(e.url);
      }
    });
  }

  getFieldNames() {
    this.loanService.getFieldname().subscribe(res => {
      this.fieldsName = res;
      this.listFieldName = this.fieldsName;

    })
  }

  onNavClick(event: any) {
    this.dataEntrySharedService.setSideNavInfo(event);
    this.dataEntrySharedService.setSelectedField(event);
    if (event === 'Data Entry') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/application-info']);
    }
    else if (event === 'View Applications(Old)') {
      this.router.navigate(['data-entry/dataentry-home/view-application-old']);
    }
    else if (event === 'View Applications') {
      this.router.navigate(['data-entry/dataentry-home/view-application']);
    }
    else if (event === 'NFIS') {
      this.router.navigate(['data-entry/dataentry-home/nfis-list']);
    }
    else if (event === 'TU') {
      this.router.navigate(['data-entry/dataentry-home/tu-list']);
    }
    else if (event === 'Import') {
      this.router.navigate(['data-entry/dataentry-home/import']);
    }
    else if (event === 'Export') {
      this.router.navigate(['data-entry/dataentry-home/export']);
    }
  }

  sideNavGetData() {
    this.currentPage = this.router.url;

    const lastSlashIndex = this.currentPage.lastIndexOf('/');
    const previousRoute = this.currentPage.slice(0, lastSlashIndex);
    if (previousRoute.endsWith('/stepper-main')) {
      this.currentPanel = 'Data Entry'

    }
    else if (this.currentPage.endsWith('/view-application-old')) {
      this.currentPanel = 'View Applications(Old)'

    }
    else if (this.currentPage.endsWith('/view-application')) {
      this.currentPanel = 'View Applications'

    }
    else if (this.currentPage.endsWith('/nfis-list')) {
      this.currentPanel = 'NFIS'
    }
    else if (this.currentPage.endsWith('/tu-list')) {
      this.currentPanel = 'TU'
    }
    else if (this.currentPage.endsWith('/import')) {
      this.currentPanel = 'Import'
    }
    else if (this.currentPage.endsWith('/export')) {
      this.currentPanel = 'Export'
    }
  }
  // INITIAL DECLARATION OF BREADCRUMBS
  declareInitialPaths() {
    this.activePathList = [
      // DATA ENTRY BREADCRUMBS
      { path: '/data-entry/dataentry-home/stepper-main/application-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'application-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'application-info'] }, { name: 'Application Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'application-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/personal-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'personal-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'personal-info'] }, { name: 'Personal Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'personal-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/address-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'address-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'address-info'] }, { name: 'Address Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'address-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/employment-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'employment-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'employment-info'] }, { name: 'Employment Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'employment-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/evaluation-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'evaluation-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'evaluation-info'] }, { name: 'Evaluation Process', url: ['data-entry', 'dataentry-home', 'stepper-main', 'evaluation-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/card-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'card-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'card-info'] }, { name: 'Card Details', url: ['data-entry', 'dataentry-home', 'stepper-main', 'card-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/loan-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'loan-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'loan-info'] }, { name: 'Loan Details', url: ['data-entry', 'dataentry-home', 'stepper-main', 'loan-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/spouse-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'spouse-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'spouse-info'] }, { name: 'Spouse Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'spouse-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/personal-ref-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'personal-ref-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'personal-ref-info'] }, { name: 'Personal Reference Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'personal-ref-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/supplementary-info', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'supplementary-info'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'supplementary-info'] }, { name: 'Supplementary Information', url: ['data-entry', 'dataentry-home', 'stepper-main', 'supplementary-info'] }] },
      { path: '/data-entry/dataentry-home/stepper-main/fileupload-step', activePanel: 'Data Entry', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'stepper-main', 'fileupload-step'] }, { name: 'Data Entry', url: ['data-entry', 'dataentry-home', 'stepper-main', 'fileupload-step'] }, { name: 'File Upload', url: ['data-entry', 'dataentry-home', 'stepper-main', 'fileupload-step'] }] },

      { path: '/data-entry/dataentry-home/view-application', activePanel: 'View Applications', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Card Application', url: ['data-entry', 'dataentry-home', 'view-application'] }, { name: 'View Applications', url: ['data-entry', 'dataentry-home', 'view-application'] }] },

      // /data-entry/dataentry-home/nfis-list
      { path: '/data-entry/dataentry-home/nfis-list', activePanel: 'NFIS', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'External System', url: ['data-entry', 'dataentry-home', 'nfis-list'] }, { name: 'NFIS', url: ['data-entry', 'dataentry-home', 'nfis-list'] }] },
      { path: '/data-entry/dataentry-home/tu-list', activePanel: 'TU', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'External System', url: ['data-entry', 'dataentry-home', 'tu-list'] }, { name: 'TU', url: ['data-entry', 'dataentry-home', 'tu-list'] }] },
      { path: '/data-entry/dataentry-home/import', activePanel: 'Import', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Import/Export', url: ['data-entry', 'dataentry-home', 'import'] }, { name: 'Import', url: ['data-entry', 'dataentry-home', 'import'] }] },
      { path: '/data-entry/dataentry-home/export', activePanel: 'Export', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Import/Export', url: ['data-entry', 'dataentry-home', 'export'] }, { name: 'Export', url: ['data-entry', 'dataentry-home', 'export'] }] },
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

export class ColumnList {
  public fields: any;
  public status?: string;
  public id?: number;
  public initialStatus?: string;
}
export class SideNav {
  navName: string;
  navIcon: string;
  selectedNav?: boolean;
  activeOnPanels?: string[];
  routerLink?: string;
  subNav?: SideNav[];
}