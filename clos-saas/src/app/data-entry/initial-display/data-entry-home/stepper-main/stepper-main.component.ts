import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Component({
  selector: 'app-stepper-main',
  templateUrl: './stepper-main.component.html',
  styleUrls: ['./stepper-main.component.scss']
})
export class StepperMainComponent implements OnInit {

  lastRouteSegment: string;
  activeStepIndex: number;
  getSideNavInfo: string;
  @Input() selectedNavName: string;
  private subscriptions: Subscription;
  activeStatus: boolean = false;
  receivedDatafromSave: boolean;
  receivedDatafromFileUpload:boolean;
  receivedDatafromFileUploadUpdate:boolean;
  activeTabName: string;
  initialHeaderName: string;
  activeSubStepIndex: string;
  initialSubHeaderName: string;
  activeSubTabName: string;
  selectOption:any[]=['Create Entry', 'Edit Entry']
  selectedOption: string = 'Create Entry';

  matTabHeaders: MatTabHeaders[] = [{ matInfo: 'Application Information', }, { matInfo: 'Personal Information', }, { matInfo: 'Address Information', }, { matInfo: 'Employment Information', }, { matInfo: 'Evaluation Process', }, { matInfo: 'Card Details', },
  { matInfo: 'Loan Details', }, { matInfo: 'Spouse Information', }, { matInfo: 'Personal Reference Information', }, { matInfo: 'Supplementary Information', }, { matInfo: 'File Upload', }]

  matInfoSubFields: MatInfoSubFields[] = [{ matInfoSub: 'Supplementary Information', }, { matInfoSub: 'Supplementary Information 1', }, { matInfoSub: 'Supplementary Information 2', }, { matInfoSub: 'Supplementary Information 3', }, { matInfoSub: 'Supplementary Information 4', }, { matInfoSub: 'Supplementary Information 5', },
  { matInfoSub: 'Supplementary Information 6', }, { matInfoSub: 'Supplementary Information 7', }, { matInfoSub: 'Supplementary Information 8', }, { matInfoSub: 'Supplementary Information 9', }]

  constructor(
    private router: Router,
    private dataEntrySharedService: DataEntrySharedService,
    public encryptDecryptService: EncryptDecryptService,
  ) 
  
  {
    this.initialHeaderName = this.encryptDecryptService.decryptData(localStorage.getItem("ACTIVELABEL"))
    this.initialSubHeaderName = this.encryptDecryptService.decryptData(localStorage.getItem("ACTIVESUBLABEL"))
    if (this.initialHeaderName) {
      this.activeTabName = this.initialHeaderName
    }
    else {
      this.activeTabName = 'Application Information'
    }
    if (this.initialSubHeaderName) {
      this.activeSubTabName = this.initialSubHeaderName
    }


    this.dataEntrySharedService.savedata.subscribe(data => {
      this.receivedDatafromSave = data;
      this.activeStatusAfterSaveClick()
    });

    this.dataEntrySharedService.fileUploadData.subscribe(data => {
      this.receivedDatafromFileUpload = data;
      this.activeStatusAfterFileUploadClick()
    });

    this.dataEntrySharedService.fileUploadUpdateData.subscribe(data => {
      this.receivedDatafromFileUploadUpdate = data;
      this.activeStatusAfterFileUploadUpdateClick()
    });

    this.activeSubTabName = 'Supplementary Information'
    this.dataEntrySharedService.setSupplementarySubTabName(this.activeSubTabName);
  }

  ngOnInit(): void {
    localStorage.removeItem('ACTIVESUBLABEL')
    const url = window.location.href;
    const segments = url.split('/');
    this.lastRouteSegment = segments.pop();
    this.checkIndex();
    this.getSideNaviation()
    this.matSelectOptionDetect();
  }

  checkIndex() {
    const url = window.location.href;
    const segments = url.split('/');
    this.lastRouteSegment = segments.pop();
    if (this.lastRouteSegment == 'application-info') {
      this.activeStepIndex = 0;
    }
    else if (this.lastRouteSegment == 'personal-info') {
      this.activeStepIndex = 1;
    }
    else if (this.lastRouteSegment == 'address-info') {
      this.activeStepIndex = 2;
    }
    else if (this.lastRouteSegment == 'employment-info') {
      this.activeStepIndex = 3;
    }
    else if (this.lastRouteSegment == 'evaluation-info') {
      this.activeStepIndex = 4;
    }
    else if (this.lastRouteSegment == 'card-info') {
      this.activeStepIndex = 5;
    }
    else if (this.lastRouteSegment == 'loan-info') {
      this.activeStepIndex = 6;
    }
    else if (this.lastRouteSegment == 'spouse-info') {
      this.activeStepIndex = 7;
    }
    else if (this.lastRouteSegment == 'personal-ref-info') {
      this.activeStepIndex = 8;
    }
    else if (this.lastRouteSegment == 'supplementary-info') {
      this.activeStepIndex = 9;
    }
    else if (this.lastRouteSegment == 'fileupload-step') {
      this.activeStepIndex = 10;
    }
  }

  onStepSelectionChange(event: any) {
    if (event.tab.textLabel === 'Application Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/application-info']);
      this.activeStepIndex = 0
    }
    else if (event.tab.textLabel === 'Personal Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/personal-info']);
      this.activeStepIndex = 1
    }
    else if (event.tab.textLabel === 'Address Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/address-info']);
      this.activeStepIndex = 2
    }
    else if (event.tab.textLabel === 'Employment Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/employment-info']);
      this.activeStepIndex = 3
    }
    else if (event.tab.textLabel === 'Evaluation Process') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/evaluation-info']);
      this.activeStepIndex = 4
    }
    else if (event.tab.textLabel === 'Card Details') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/card-info']);
      this.activeStepIndex = 5
    }
    else if (event.tab.textLabel === 'Loan Details') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/loan-info']);
      this.activeStepIndex = 6
    }
    else if (event.tab.textLabel === 'Spouse Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/spouse-info']);
      this.activeStepIndex = 7
    }
    else if (event.tab.textLabel === 'Personal Reference Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/personal-ref-info']);
      this.activeStepIndex = 8
    }
    else if (event.tab.textLabel === 'Supplementary Information') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/supplementary-info']);
      this.activeStepIndex = 9
    }
    else if (event.tab.textLabel === 'File Upload') {
      this.router.navigate(['data-entry/dataentry-home/stepper-main/fileupload-step']);
      this.activeStepIndex = 10
    }
    this.activeTabName = event.tab.textLabel;
    this.encryptDecryptService.encryptData(localStorage.setItem("ACTIVELABEL", this.activeTabName))
  }

  onSubStepSelectionChange(event: any) {
    this.activeSubTabName = event.tab.textLabel;
    this.dataEntrySharedService.setSupplementarySubTabName(this.activeSubTabName);
    this.encryptDecryptService.encryptData(localStorage.setItem("ACTIVESUBLABEL", this.activeSubTabName))
  }

  getSideNaviation() {
    this.getSideNavInfo = this.dataEntrySharedService.getInputValue();
  }

  ngOnDestroy() {
    localStorage.removeItem('ACTIVELABEL')
    localStorage.removeItem('ACTIVESUBLABEL')
    this.dataEntrySharedService.resetInputValue()
    if(this.subscriptions){
      this.subscriptions.unsubscribe()
    }

  }

  activeStatusAfterSaveClick() {
    if (this.receivedDatafromSave === true) {
      this.activeStepIndex = 10;
    }
  }
  
  activeStatusAfterFileUploadClick(){
    if (this.receivedDatafromFileUpload === true) {
      this.activeStepIndex = 0;
      this.subscriptions = interval(200).subscribe(() => {
        this.checkIndex()
      });
    }
  }

  activeStatusAfterFileUploadUpdateClick(){
    if (this.receivedDatafromFileUploadUpdate === true) {
      this.activeStepIndex = 0;
      this.subscriptions = interval(200).subscribe(() => {
        this.checkIndex()
      });
    }
  }

  selectEntryOption(){
    this.dataEntrySharedService.setMatSelectOption(this.selectedOption);

  }
  matSelectOptionDetect(){
    this.dataEntrySharedService.setMatSelectOption(this.selectedOption);
  }

}

export class MatTabHeaders {
  public matInfo: string;
  public matInfoSubFields?: MatInfoSubFields[];
}

export class MatInfoSubFields {
  public matInfoSub: string;
  public subIcon?: string;
}
