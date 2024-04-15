import { object } from '@amcharts/amcharts5';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';

@Component({
  selector: 'app-view-result-status',
  templateUrl: './view-result-status.component.html',
  styleUrls: ['./view-result-status.component.scss']
})
export class ViewResultStatusComponent implements OnInit {
  //INITIAL STATUS DECLARATION
  initialStatus: any[];
  // DUPLICATE STATUS DECLARATIONS
  mergedData: any[]
  duplicatestatus: any[];
  objectValues: any[]
  objectValuesArray: any[]
  objedtKey: any[];
  // DUPLICATE STATUS DECLARATIONS
  negativestatus: any[];
  objectNegativeValuesArray: any[];
  externalKYCStatus: any[];
  objectExternalValuesArray: any[];
  //TABS DECLARATIONS 
  applicationid: number;
  initialvalue: string;
  stage: string = 'initial';
  isPrb: boolean = false;
  mainTabs: any[] = []; // Initialize as an empty array
  subTabs: any[] = []; // Initialize as an empty array
  selectedMainTabIndex: number = 0;
  selectedSubTabIndex: number = 0;
  selectedSubTabs: any[] = [];
  isLoading: boolean = false;
  isEmpty: boolean = false;
  matchedField: any[] = [];
  matchedNegativeField: any[] = [];
  matchedKYCField: any[] = [];
  applicationDetails: any;
  constructor(
    private defaultService: LoanServiceService,
    public caseManagerService:CLosService,
    private closService: CLosService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
  ) {
    console.log("ids", this.data);
    this.mainTabs = [
      { name: 'Initial' },
      { name: 'Internal KYC' },
      { name: 'External KYC' },
    ];
    this.subTabs = [
      [],
      [{ name: 'Duplicate Checking' },
      { name: 'Negative Checking' }],
    ];
  }

  ngOnInit(): void {
    this.getapplicationStatus();
    this.getDataById(this.data);
  }
  getDataById(id:any) {
    this.caseManagerService.getApplicationDetailsByID(id).subscribe(
      res => {
        this.applicationDetails = res;
        console.log(res)
      }
    )
  }

  // MAIN TAB FUNCTIONS
  onMainTabChangeEvent(event: any) {
    this.selectedMainTabIndex = event.index;
    if (this.selectedMainTabIndex == 0) {
      this.stage = 'initial';
    } 
    else if (this.selectedMainTabIndex == 1) {
      this.stage = 'DUPLICATE CHECKING';
      if (this.selectedSubTabIndex == 0) {
        this.stage = 'DUPLICATE CHECKING';
      } else if (this.selectedSubTabIndex == 1) {
        this.stage = 'NEGATIVE CHECKING';
      }
    }
    else if (this.selectedMainTabIndex == 2) {
      this.stage = 'EXTERNAL KYC CHECKING';
    }
    this.getapplicationStatus();
  }

  // SUBTABS FUNCTIONS 
  onsubTabChangeEvent(event: any, mainTabIndex: number) {
    this.selectedSubTabIndex = event.index;
    // Check if the selected main tab is the "Duplicate Matching Stage"
    if (mainTabIndex === 1) {
      // Get the sub-tabs for the "Duplicate Matching Stage" main tab
      const subTabsForDuplicateMatching = this.subTabs[mainTabIndex];
      // Get the name of the selected sub-tab
      this.stage = subTabsForDuplicateMatching[this.selectedSubTabIndex].name?.toUpperCase();
      console.log('STAGE', this.stage)
      // Now you have the name of the selected sub-tab under the "Duplicate Matching Stage" main tab
    }
    this.getapplicationStatus();
  }


  // GET  STATUS 
  getapplicationStatus() {
    this.isLoading = true;
    this.closService.getApplicationStatus(this.data, this.stage?.toUpperCase()).subscribe(res => {
      if (this.stage === 'initial') {
        this.initialStatus = res['INITIAL STAGE'];
        this.isLoading = false;
        this.isEmpty = this.isStageDataEmpty(this.initialStatus)
      }
      else if (this.stage === 'DUPLICATE CHECKING') {
        this.duplicatestatus = res['DUPLICATE CHECKING'];
        if (this.duplicatestatus && this.duplicatestatus['DATA']) {
          this.objectValuesArray = this.duplicatestatus['DATA'].map(item => ({
            key: this.duplicatestatus['TABLE_NAME'],
            value: item
          }));
        }
        const matchedTableFieldsArray = this.duplicatestatus['DATA'][0]['MATCHED_TABLE_FIELDS'];
        const validFields = matchedTableFieldsArray.filter(field => field !== null);
        const randomIndex = Math.floor(Math.random() * validFields.length);
        const selectedField = validFields[randomIndex];
        const splitFields = selectedField ? selectedField.split(',') : [];
        this.matchedField = splitFields;
        this.isLoading = false;
        this.isEmpty = this.isStageDataEmpty(this.duplicatestatus['DATA'])
      }
      else if (this.stage === 'NEGATIVE CHECKING') {
        this.negativestatus = res['NEGATIVE CHECKING'];
        if (this.negativestatus && this.negativestatus['DATA']) {
          this.objectNegativeValuesArray = this.negativestatus['DATA'].map(item => ({
            key: this.negativestatus['TABLE_NAME'],
            value: item
          }));
        }
        const matchedTableFieldsArray = this.negativestatus['DATA'][0]['MATCHED_TABLE_FIELDS'];
        const validFields = matchedTableFieldsArray.filter(field => field !== null);
        const randomIndex = Math.floor(Math.random() * validFields.length);
        const selectedField = validFields[randomIndex];
        const splitFields = selectedField ? selectedField.split(',') : [];
        this.matchedNegativeField = splitFields;
        this.isLoading = false;
        this.isEmpty = this.isStageDataEmpty(this.negativestatus['DATA'])
      }
      else if (this.stage === 'EXTERNAL KYC CHECKING') {
        this.externalKYCStatus = res['EXTERNAL KYC CHECKING'];
        if (this.externalKYCStatus && this.externalKYCStatus['DATA']) {
          this.objectExternalValuesArray = this.externalKYCStatus['DATA'].map(item => ({
            key: this.externalKYCStatus['TABLE_NAME'],
            value: item
          }));
        }
        const matchedTableFieldsArray = this.externalKYCStatus['DATA'][0]['MATCHED_TABLE_FIELDS'];
        const validFields = matchedTableFieldsArray.filter(field => field !== null);
        const randomIndex = Math.floor(Math.random() * validFields.length);
        const selectedField = validFields[randomIndex];
        const splitFields = selectedField ? selectedField.split(',') : [];
        this.matchedKYCField = splitFields;
        this.isLoading = false;
        this.isEmpty = this.isStageDataEmpty(this.externalKYCStatus['DATA'])
      }

    })
  }
  // FUNCTION TO CHECK IF THE DATA FOR A STAGE IS EMPTY
  isStageDataEmpty(stageData: any): boolean {
    if (stageData === null || stageData === undefined) {
      return true;
    }
  
    if (Array.isArray(stageData)) {
      return stageData.every(item => this.isStageDataEmpty(item));
    }
  
    if (typeof stageData === 'object') {
      return Object.values(stageData).every(value => this.isStageDataEmpty(value));
    }
  
    if (typeof stageData === 'string' && stageData.trim() === '') {
      return true;
    }
  
    return stageData.constructor === Object && Object.keys(stageData).length === 0;
  };

}

