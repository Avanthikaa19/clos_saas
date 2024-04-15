import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatInfoSubTab, MatTabHeaders } from './models/application-entry';
import { CLosService } from '../../service/c-los.service';
import { ApplicationDetails } from '../../models/clos';
import { ApplicationEntryService } from './service/application-entry.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
@Component({
  selector: 'app-application-entry',
  templateUrl: './application-entry.component.html',
  styleUrls: ['./application-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationEntryComponent implements OnInit {
  isTabEnabled: boolean = false;
  matTabHeader: MatTabHeaders[] = [
    { name: 'Corporate Details', icon: 'file_copy' },
    { name: 'Proxy Details', icon: 'file_copy' },
    { name: 'Loan Details', icon: 'file_copy' },
    { name: 'Collateral Details', icon: 'file_copy' },
    { name: 'Risk and Compliance', icon: 'file_copy' },
    { name: 'Applicant Details', icon: 'file_copy' },
    { name: 'Reference', icon: 'file_copy' },
    { name: 'Uploads', icon: 'file_copy' }
  ];
  matSubTabHeaders: MatInfoSubTab[] = [
    { name: 'Business and operation Information', icon: 'file_copy' },
    { name: 'Ownership', icon: 'file_copy' },
    { name: 'Subsidiaries', icon: 'file_copy' },
    { name: 'Suppliers', icon: 'file_copy' },
    { name: 'Industry Information', icon: 'file_copy' },
    { name: 'Financial Information', icon: 'file_copy' },
  ];
  matProxySubTabHeader: MatInfoSubTab[] = [
    { name: 'Company Information', icon: 'file_copy' },
    { name: 'Financial Information', icon: 'file_copy' },
  ]
  showProxyDetailsTab: boolean = false;
  activeStepIndex: number;
  activeSubStepIndex: number;
  activeProxySubStepIndex: number = 0;
  activeTabName: string;
  activeSubTabName: string;
  activeProxySubTabName:string;
  files: File[] = [];
  uploadStoredData: ApplicationDetails;
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  appId : number;
  constructor(private applicationEntryService: ApplicationEntryService,
    private router: Router,
    private closService: CLosService,
    private cdr: ChangeDetectorRef,
    public encryptDecryptService: EncryptDecryptService,
  ) {
    let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    if (window.location.reload) {
      this.router.navigate(['application-entry/corporate-details']);
    }
    this.closService.getTabState().subscribe((enabled) => {
      this.isTabEnabled = enabled;
    });
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
    (apiData) => {
      if (apiData && apiData.financialProxyCompany === 'Yes') {
        this.isTabEnabled = true;
      } else {
        this.isTabEnabled = false;
      }
    },);
  }
     
  ngOnInit(): void {  
    this.applicationEntryService.applicationDetails = this.applicationDetails;
    this.activeStepIndex = 0;
    this.activeSubStepIndex = 0;
    this.activeProxySubStepIndex = 1;
    this.showProxyDetailsTab = false;
    this.saveApplicationData()
    let data = this.closService.setUploadApplicationDetailData();
    if (data) {
      this.applicationDetails = data;
    }
    setTimeout(() => {
      this.selectMainTab('Corporate Details');
      this.selectSubTab('Business and operation Information');
    }, 10);
  }

  saveApplicationData() {
    this.applicationEntryService.applicationDetails = this.applicationDetails;
  }
  isProxyDetailsTabVisible(): boolean {
    return this.isTabEnabled;
  }
  selectMainTab(tabName: string) {
    const tabIndex = this.matTabHeader.findIndex(tab => tab.name === tabName);
    if (tabIndex !== -1) {
      this.activeStepIndex = tabIndex;
      this.activeTabName = tabName;
    }
  }
  
  selectSubTab(tabName: string) {
    const tabIndex = this.matSubTabHeaders.findIndex(tab => tab.name === tabName);
    if (tabIndex !== -1) {
      this.activeSubStepIndex = tabIndex;
      this.activeSubTabName = tabName;
      this.closService.setActiveSubTabName(tabName);
    }
  }


  onStepSelectionChange(event: any) {
     this.activeStepIndex = this.matTabHeader.findIndex(tab => tab.name === event.tab.textLabel);
    if (event.tab.textLabel !== 'Proxy Details' && !this.isTabEnabled){
      if (event.tab.textLabel === 'Corporate Details') {
        this.router.navigate(['application-entry/corporate-details']);
        this.activeStepIndex = 0;
        this.activeSubStepIndex = 0;
        this.activeSubTabName = 'Business and operation Information';
        this.cdr.detectChanges();
      }
      else if (event.tab.textLabel === 'Loan Details') {
          this.router.navigate(['application-entry/loan-details']);
          this.activeStepIndex = 1;
      }
      else if (event.tab.textLabel === 'Collateral Details') {
        this.router.navigate(['application-entry/collateral-details']);
        this.activeStepIndex = 2;
      }
      else if (event.tab.textLabel === 'Risk and Compliance') {
        this.router.navigate(['application-entry/risk&compliance-details']);
        this.activeStepIndex = 3;
      }
      else if (event.tab.textLabel === 'Applicant Details') {
        this.router.navigate(['application-entry/application-details']);
        this.activeStepIndex = 4;
      }
      else if (event.tab.textLabel === 'Reference') {
        this.router.navigate(['application-entry/reference-details']);
        this.activeStepIndex = 5;
      }
      else if (event.tab.textLabel === 'Uploads') {
        this.router.navigate(['application-entry/uploads']);
        this.activeStepIndex = 6;
      }  
      this.activeTabName = event.tab.textLabel;

    }
    if(this.isTabEnabled){ 
    if (event.tab.textLabel === 'Corporate Details') {
      this.router.navigate(['application-entry/corporate-details']);
      this.activeStepIndex = 0;
      this.activeSubStepIndex = 0;
      this.activeSubTabName = 'Business and operation Information';
      this.cdr.detectChanges();
    }
    else if (event.tab.textLabel === 'Proxy Details') {
      this.router.navigate(['application-entry/proxy-details']);
      this.activeStepIndex = 1;
      this.activeProxySubStepIndex = 0;
      this.activeProxySubTabName = 'Company Information';
      this.cdr.detectChanges();
    }
    else if (event.tab.textLabel === 'Loan Details') {
      this.router.navigate(['application-entry/loan-details']);
      this.activeStepIndex = 2
    }
    else if (event.tab.textLabel === 'Collateral Details') {
      this.router.navigate(['application-entry/collateral-details']);
      this.activeStepIndex = 3
    }
    else if (event.tab.textLabel === 'Risk and Compliance') {
      this.router.navigate(['application-entry/risk&compliance-details']);
      this.activeStepIndex = 4
    }
    else if (event.tab.textLabel === 'Applicant Details') {
      this.router.navigate(['application-entry/application-details']);
      this.activeStepIndex = 5
    }
    else if (event.tab.textLabel === 'Reference') {
      this.router.navigate(['application-entry/reference-details']);
      this.activeStepIndex = 6
    }
    else if (event.tab.textLabel === 'Uploads') {
      this.router.navigate(['application-entry/uploads']);
      this.activeStepIndex = 7
    }
    this.activeTabName = event.tab.textLabel;

  }
  }

  onSubStepSelectionChange(event: any) {
     this.activeSubStepIndex = this.matSubTabHeaders.findIndex(tab => tab.name === event.tab.textLabel);
    this.activeSubTabName = event.tab.textLabel;
    this.closService.setActiveSubTabName(this.activeSubTabName);
    console.log(this.activeSubTabName)
  }
  onProxySubStepSelectionChange(event: any) {
    this.activeProxySubTabName = event.tab.textLabel;
    this.closService.setProxyActiveSubTabName(this.activeProxySubTabName);
    console.log(this.activeProxySubTabName)
  }
  goToPreviousStep() {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex--;
      this.navigateToSelectedStep();
    }
  }

  goToNextStep() {
    if (this.activeStepIndex < 7) {
      this.activeStepIndex++;
      this.navigateToSelectedStep();
    }
  }

  private navigateToSelectedStep() {
    if (!this.isTabEnabled){
      if (this.activeStepIndex === 0) {
        this.router.navigate(['application-entry/corporate-details']);
       this.activeSubTabName = this.matSubTabHeaders[this.activeSubStepIndex].name;
        this.cdr.detectChanges();
      }
      else if (this.activeStepIndex === 1) {
        this.router.navigate(['application-entry/loan-details']);
      } 
      else if (this.activeStepIndex === 2) {
        this.router.navigate(['application-entry/collateral-details']);
      }
    else  if (this.activeStepIndex === 3) {
      this.router.navigate(['application-entry/risk&compliance-details']);
    }
    else if (this.activeStepIndex === 4) {
      this.router.navigate(['application-entry/application-details']);
    }
    else if (this.activeStepIndex === 5) {
      this.router.navigate(['application-entry/reference-details']);
    } else if (this.activeStepIndex === 6) {
      this.router.navigate(['application-entry/uploads']);
    }
    else {
      const selectedStepName = this.matTabHeader[this.activeStepIndex].name;
      this.router.navigate(['application-entry', selectedStepName.toLowerCase().replace(/\s/g, '-')]);
      this.activeTabName = selectedStepName;
      this.activeSubStepIndex = 0;
    }
  }
  if (this.isTabEnabled){
    if (this.activeStepIndex === 0) {
      this.router.navigate(['application-entry/corporate-details']);
    } 
    else if (this.activeStepIndex === 1) {
      this.router.navigate(['application-entry/proxy-details']);
    } 
    else if (this.activeStepIndex === 2) {
      this.router.navigate(['application-entry/loan-details']);
    }
  else  if (this.activeStepIndex === 3) {
    this.router.navigate(['application-entry/collateral-details']);
  }
  else if (this.activeStepIndex === 4) {
    this.router.navigate(['application-entry/risk&compliance-details']);
  }
  else if (this.activeStepIndex === 5) {
    this.router.navigate(['application-entry/application-details']);
  } else if (this.activeStepIndex === 6) {
    this.router.navigate(['application-entry/reference-details']);
  }
  else if (this.activeStepIndex === 7) {
    this.router.navigate(['application-entry', 'uploads']);
  }
  else {
    const selectedStepName = this.matTabHeader[this.activeStepIndex].name;
    this.router.navigate(['application-entry', selectedStepName.toLowerCase().replace(/\s/g, '-')]);
    this.activeTabName = selectedStepName;
    this.activeSubStepIndex = 0;
  }
}
  }


  submitApplication() {
    // Implement your submission logic here
  }
}

