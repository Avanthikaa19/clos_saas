import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SearchScope } from 'src/app/dynamic-dashboard/dynamic-dashboard/models/model';
import { CustomServiceService } from 'src/app/dynamic-dashboard/dynamic-dashboard/service/custom-service.service';
import { SideNav } from 'src/app/loan-application/components/main-nav/main-nav.component';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { ClosCaseManagerService } from '../../service/clos-case-manager.service';
import { ActivePanelPath } from './Navigation';

@Component({
  selector: 'app-case-manager-main',
  templateUrl: './case-manager-main.component.html',
  styleUrls: ['./case-manager-main.component.scss']
})
export class CaseManagerMainComponent implements OnInit {
  breadcrumbHeader: string = 'Term Loan';
  navigationElements: SideNav[] = [
    {
      navName: "Term Loan",
      navIcon: "credit_card",
      routerLink: "",
      selectedNav: false,
      isExpanded: true,
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
    },
    {
      navName: "Working Capital Loan",
      navIcon: "attach_money",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Revolving Credit Lines",
      navIcon: "receipt",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Equipment Financing",
      navIcon: "settings",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Commercial Real Estate Loan",
      navIcon: "aspect_ratio",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Invoice Financing",
      navIcon: "store",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Trade Finance",
      navIcon: "store",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Bridge Loan",
      navIcon: "store",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Mezzanine Loan",
      navIcon: "store",
      routerLink: "",
      selectedNav: false,
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
    },
    {
      navName: "Debt Consolidation Loan",
      navIcon: "store",
      routerLink: "",
      selectedNav: false,
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
    },
  ];

  currentURL: string = "";
  currentPanel: string = "...";
  selectedNav: string = "";
  breadCrumbList: any[] = [];
  activePathList: ActivePanelPath[] = [];
  screenList: any = [];
  dashList: boolean = false;
  listOpen: boolean = false;
  dashName: string = '';
  getUserName: any = '';
  searchscope: SearchScope = new SearchScope(10, 'clos')
  pageNumber: number = 0;
  allTemplate: any = [];
  totalCount: number;
  screens: any = [];
  keyword: any = '';
  navName: string = 'Term Loan';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public customService: CustomServiceService,
    private defaultService: ClosCaseManagerService,
    public encryptDecryptService: EncryptDecryptService,
  ) {
    this.currentURL = this.router.url;

  }

  ngOnInit(): void {
    // FOR SIDE NAV
    this.currentPanel = this.getCurrentPathNameForBreadCrumbs(this.router.url);
    this.defaultService.setData({ data: this.navName });
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentPanel = this.getCurrentPathNameForBreadCrumbs(routerEvent.url);
      }
      else if (routerEvent instanceof NavigationEnd) {
        this.currentPanel = this.getCurrentPathNameForBreadCrumbs(routerEvent.url);
      }
    })
    this.getScreen();
  }
  getScreen() {
    this.customService.getScreen().subscribe(res => {
      this.screenList = res;
    })
  }

  onNavClick(navElement: SideNav, item: SideNav) {
    this.navName = item.navName;
    console.log(this.navName);
    this.defaultService.setData({ data: this.navName });
    let url = this.currentURL;
    url = url.substring(0, url.lastIndexOf("/"));
    this.router.navigateByUrl(url + "/" + navElement.routerLink);
    this.currentPanel = this.getCurrentPathNameForBreadCrumbs(this.router.url);
  }

  moduleSelection(navElement: SideNav) {
    console.log("Nav Element", navElement);
  }

  navToUrl(link: any) {
    if (!link.isNav) {
      this.router.navigate(link.url)
    }
  }
  getBreadCrumb(name) {
    this.breadcrumbHeader = name;
    this.declareInitialPaths()
  }

  declareInitialPaths() {
    this.activePathList = [
      //CASH MANAGER BREADCRUMBS
      { path: '/loan-case-manager/loan-case-manager-main/application-verification', activePanel: 'Application Verification', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: this.breadcrumbHeader, url: ['loan-case-manager', 'loan-case-manager-main', 'application-verification'] }, { name: 'Application Verification', url: ['loan-case-manager', 'loan-case-manager-main', 'application-verification'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/underwriting', activePanel: 'Underwriting', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: this.breadcrumbHeader, url: ['loan-case-manager', 'loan-case-manager-main', 'underwriting'] }, { name: 'Underwriting', url: ['loan-case-manager', 'loan-case-manager-main', 'underwriting'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/loan-approval', activePanel: 'Loan Approval', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: this.breadcrumbHeader, url: ['loan-case-manager', 'loan-case-manager-main', 'loan-approval'] }, { name: 'Loan Approval', url: ['loan-case-manager', 'loan-case-manager-main', 'loan-approval'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/document-verification', activePanel: 'Document Verification', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: this.breadcrumbHeader, url: ['loan-case-manager', 'loan-case-manager-main', 'document-verification'] }, { name: 'Document Verification', url: ['loan-case-manager', 'loan-case-manager-main', 'document-verification'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/depositerBase', activePanel: 'Depositer Base', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Depositor Base', url: ['loan-case-manager', 'loan-case-manager-main', 'depositerBase'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/internal-scoring-list', activePanel: 'Duplicate Matching', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Duplicate Matching', url: ['loan-case-manager', 'loan-case-manager-main', 'internal-scoring-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/Prb-special-handling-list', activePanel: 'PRB-Special Handling', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'PRB Special Handling List', url: ['loan-case-manager', 'loan-case-manager-main', 'Prb-special-handling-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/nfis-matching-stage', activePanel: 'NFIS Matching Stage', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'NFIS Matching Stage', url: ['loan-case-manager', 'loan-case-manager-main', 'nfis-matching-stage'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/ntp-approve-list', activePanel: 'T24-Stage', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'T24-Stage', url: ['loan-case-manager', 'loan-case-manager-main', 'ntp-approve-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/tu-stage-list', activePanel: 'TU-Stage', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'TU-Stage', url: ['loan-case-manager', 'loan-case-manager-main', 'tu-stage-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/nth-camm-stage-list', activePanel: 'Nth-CAMM-Address Verification', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Nth-CAMM-Address Verification', url: ['loan-case-manager', 'loan-case-manager-main', 'nth-camm-stage-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/nth-tu-stage-list', activePanel: 'Nth-TU-Address Verification', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Nth-TU-Address Verification', url: ['loan-case-manager', 'loan-case-manager-main', 'nth-tu-stage-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/fraud-review-stage', activePanel: 'Fraud Review Stage', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Fraud Review Stage', url: ['loan-case-manager', 'loan-case-manager-main', 'fraud-review-stage'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/List-stage', activePanel: 'List Based Stage', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'List Based Stage', url: ['loan-case-manager', 'loan-case-manager-main', 'List-stage'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/employee-card-stage', activePanel: 'Employee Card Stage', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Employee Card Stage', url: ['loan-case-manager', 'loan-case-manager-main', 'employee-card-stage'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/credit-review', activePanel: 'Credit Review', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Credit Review', url: ['loan-case-manager', 'loan-case-manager-main', 'credit-review'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/ci-application-list', activePanel: 'CI Applications', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'CI Applications', url: ['loan-case-manager', 'loan-case-manager-main', 'ci-application-list'] }] },
      { path: '/loan-case-manager/loan-case-manager-main/reprocess-application', activePanel: 'Reprocess Application', breadCrumbs: [{ name: 'Home', url: ['home'] }, { name: 'Reprocess Application', url: ['loan-case-manager', 'loan-case-manager-main', 'reprocess-application'] }] },
    ]
  }
  // TO GET ACTIVE PATH BREADCRUMB
  getCurrentPathNameForBreadCrumbs(path: string) {
    console.log(path)
    this.declareInitialPaths();75
    for (let i = 0; i < this.activePathList.length; i++) {
      console.log(this.activePathList,'asd');
      if (path.endsWith(this.activePathList[i].path)) {
        this.breadCrumbList = this.activePathList[i].breadCrumbs;
        console.log(this.breadCrumbList,'asd');
        console.log(this.breadcrumbHeader)
        return this.activePathList[i].activePanel
      }
    }
    return path;
  }
  openDashboard(name) {
    this.listOpen = !this.listOpen;
    this.dashList = true;
    this.dashName = name;
    this.getTemplate();
  }
  getMapping(name) {
    sessionStorage.setItem('dashName', name);
    let user = sessionStorage.getItem(AUTHENTICATED_USER)
    this.getUserName = this.encryptDecryptService.decryptData(user);
    this.customService.getMapping(name, this.getUserName, this.pageNumber, this.searchscope.pageSize, '').subscribe(res => {
      //   this.allTemplate = res['result'];
      let data = res['result']
      this.totalCount = res['count']
      this.screens = [];
      this.allTemplate = [];
      this.allTemplate?.forEach(e => {
        this.screens?.push(e.selectedScreen);
      })
      data?.forEach(e => {
        this.allTemplate?.push(e)
      })
    })
  }
  Id: any;

  viewDashboard(id) {
    this.Id = id;
    this.customService.getTemplateWithId(id).subscribe(res => {
      let layout = res;
      layout.widget.map((element) => {
        element.actualData = JSON.parse(element.data);
      });
      sessionStorage.setItem('gridlayout', JSON.stringify(res));
      //   window.location.reload();
      this.router.navigate(['/dynamic/dynamic/dashboardMapping']);
    })
  }

  getTemplate() {
    this.customService.getTypesOfTemplate(this.searchscope.pageSize, this.pageNumber, this.keyword, 'desc', 'id').subscribe(res => {
      this.allTemplate = res['data'];
      this.totalCount = res['count'];
    })
    this.viewDashboard(this.Id)
  }
}
