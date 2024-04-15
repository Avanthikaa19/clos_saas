import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-supplementary-information',
  templateUrl: './supplementary-information.component.html',
  styleUrls: ['./supplementary-information.component.scss']
})
export class SupplementaryInformationComponent implements OnInit {

  @ViewChild('supplementaryInfoForm') supplementaryInfoForm!: NgForm;
  listFieldName: ColumnList = new ColumnList();
  private subscription: Subscription;
  currentURL: string;
  applicationFormValid: any;
  addressFormValid: any;
  personalFormValid: any;
  loanFormValid: any;
  cardDetailsFormValid: any;
  employmentFormValid: any;
  spouseFormValid: any;
  personalRefFormValid: any;
  inputValue: any;
  evaluationFormValid: any;
  formInvalid: boolean = false;
  formSubmitted:boolean=false
  activeStepperStatus: boolean = false;
  conditonForUpdate:boolean;
  subTabName: string = 'Supplementary Information';
  s1GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s2GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s3GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s4GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s5GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s6GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s7GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s8GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s9GenderList: any[] = [{ name: 'Male', value: '0' }, { name: 'Female', value: '1' }, { name: 'Unknown', value: '2' }]
  s1MaritalList: any[] = [{ name: 'Single', value: '0' }, { name: 'Married', value: '1' }, { name: 'Divorce', value: '2' }, { name: 'Widow', value: '3' }]
  s2MaritalList: any[] = [{ name: 'Single', value: '0' }, { name: 'Married', value: '1' }, { name: 'Divorce', value: '2' }, { name: 'Widow', value: '3' }]
  s3MaritalList: any[] = [{ name: 'Single', value: '0' }, { name: 'Married', value: '1' }, { name: 'Divorce', value: '2' }, { name: 'Widow', value: '3' }]
  s1SourceofFundList: any[] = [{ name: 'Employment', value: 'EMP' }, { name: 'Business', value: 'BUSS' }, { name: 'Retired', value: 'RET' }, { name: 'Allownace', value: 'ALLO' }, { name: 'Remittance', value: 'REM' }, { name: 'Others', value: 'OTH' }]
  s2SourceofFundList: any[] = [{ name: 'Employment', value: 'EMP' }, { name: 'Business', value: 'BUSS' }, { name: 'Retired', value: 'RET' }, { name: 'Allownace', value: 'ALLO' }, { name: 'Remittance', value: 'REM' }, { name: 'Others', value: 'OTH' }]
  s3SourceofFundList: any[] = [{ name: 'Employment', value: 'EMP' }, { name: 'Business', value: 'BUSS' }, { name: 'Retired', value: 'RET' }, { name: 'Allownace', value: 'ALLO' }, { name: 'Remittance', value: 'REM' }, { name: 'Others', value: 'OTH' }]
  s1EmploymentTypelIst: any[] = [{ name: 'Private sector', value: '1' }, { name: 'Government', value: '2' }, { name: 'Self employed', value: '3' }, { name: 'Retired', value: '4' }]
  s2EmploymentTypelIst: any[] = [{ name: 'Private sector', value: '1' }, { name: 'Government', value: '2' }, { name: 'Self employed', value: '3' }, { name: 'Retired', value: '4' }]
  s3EmploymentTypelIst: any[] = [{ name: 'Private sector', value: '1' }, { name: 'Government', value: '2' }, { name: 'Self employed', value: '3' }, { name: 'Retired', value: '4' }]
  entryOption: string;


  constructor(
    private dataEntrySharedService: DataEntrySharedService,
    private loanService: LoanServiceService,
    public router: Router,
  ) {
    this.currentURL = this.router.url;
    this.applicationFormValid = this.dataEntrySharedService.getApplicationFormValidity();
    this.addressFormValid = this.dataEntrySharedService.getAddressFormValidity();
    this.personalFormValid = this.dataEntrySharedService.getPersonalInfoFormValidity();
    this.loanFormValid = this.dataEntrySharedService.getLoanInfoFormValidity();
    this.employmentFormValid = this.dataEntrySharedService.getEmploymentInfoFormValidity();
    this.cardDetailsFormValid = this.dataEntrySharedService.getCardDetailsInfoFormValidity();
    this.evaluationFormValid = this.dataEntrySharedService.getEvaluationInfoFormValidity();
    this.spouseFormValid = this.dataEntrySharedService.getSpouselInfoFormValidity();
    this.personalRefFormValid = this.dataEntrySharedService.getPersonalReferenceInfoFormValidity();
    this.conditonForUpdate = this.dataEntrySharedService.getConditionCheckForUpdate();
    console.log("conditonForUpdate,", this.conditonForUpdate)
    this.entryOption= this.dataEntrySharedService.getMatSelectOption()

  }

  ngOnInit(): void {
    this.inputValue = this.dataEntrySharedService.getInputValue();
    this.subscription = interval(200).subscribe(() => {
      this.getSubTabName()
    });
    if (this.inputValue) {
      this.listFieldName = this.inputValue
    }
    if(this.conditonForUpdate){
      this.dateFormatHanldle()
    }
  }

  onFormSubmit(): void {
    console.log("application check 1", this.applicationFormValid)
    console.log("address check", this.addressFormValid)
    console.log("personal check", this.personalFormValid)
    console.log("loan check", this.loanFormValid)
    console.log("employment check", this.employmentFormValid)
    console.log("card details check", this.cardDetailsFormValid)
    console.log("evaluation check", this.evaluationFormValid)
    console.log("spouse check", this.spouseFormValid)
    console.log("personal ref check", this.personalRefFormValid)
    console.log("supplementary detail  check", this.supplementaryInfoForm.valid)

    if (this.applicationFormValid && this.addressFormValid && this.personalFormValid && this.employmentFormValid) {
      this.formInvalid = false;
      this.formSubmitted=false
      this.listFieldName.status = 'UI_INITIATED'
      this.listFieldName.initialStatus = 'UI_INITIATED'

      if (this.listFieldName) {
        if (this.listFieldName['appmAPLDat']) {
          this.listFieldName['appmAPLDat'] = this.listFieldName['appmAPLDat'].replace(/-/g, '');
        }
        if (this.listFieldName['appmCcris1']) {
          this.listFieldName['appmCcris1'] = this.listFieldName['appmCcris1'].replace(/-/g, '')
        }
        if (this.listFieldName['appmCcris2']) {
          this.listFieldName['appmCcris2'] = this.listFieldName['appmCcris2'].replace(/-/g, '')
        }
        if (this.listFieldName['appmCcris3']) {
          this.listFieldName['appmCcris3'] = this.listFieldName['appmCcris3'].replace(/-/g, '')
        }
        if (this.listFieldName['appmnFDate']) {
          this.listFieldName['appmnFDate'] = this.listFieldName['appmnFDate'].replace(/-/g, '')
        }
        if (this.listFieldName['appxCCRis4']) {
          this.listFieldName['appxCCRis4'] = this.listFieldName['appxCCRis4'].replace(/-/g, '')
        }
        if (this.listFieldName['appxCCRis5']) {
          this.listFieldName['appxCCRis5'] = this.listFieldName['appxCCRis5'].replace(/-/g, '')
        }
        if (this.listFieldName['appmDob']) {
          this.listFieldName['appmDob'] = this.listFieldName['appmDob'].replace(/-/g, '')
        }
        if (this.listFieldName['appmS1Dob']) {
          this.listFieldName['appmS1Dob'] = this.listFieldName['appmS1Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS2DOb']) {
          this.listFieldName['appmS2DOb'] = this.listFieldName['appmS2DOb'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS3DOb']) {
          this.listFieldName['appmS3DOb'] = this.listFieldName['appmS3DOb'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS4Dob']) {
          this.listFieldName['appmS4Dob'] = this.listFieldName['appmS4Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS5Dob']) {
          this.listFieldName['appmS5Dob'] = this.listFieldName['appmS5Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS6Dob']) {
          this.listFieldName['appmS6Dob'] = this.listFieldName['appmS6Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS7Dob']) {
          this.listFieldName['appmS7Dob'] = this.listFieldName['appmS7Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS8Dob']) {
          this.listFieldName['appmS8Dob'] = this.listFieldName['appmS8Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS9Dob']) {
          this.listFieldName['appmS9Dob'] = this.listFieldName['appmS9Dob'].replace(/-/g, '');
        }
      }
      console.log("listFieldName", this.listFieldName)
      this.loanService.saveDataEntry(this.listFieldName).subscribe(res => {
        if (res) {
          this.dataEntrySharedService.setSubmitId(res.id)
          this.dataEntrySharedService.resetInputValue();
          let url = this.currentURL;
          url = url.substring(0, url.lastIndexOf("/"));
          this.router.navigateByUrl(url + "/" + 'fileupload-step');
          this.activeStepperStatus = true;
          this.dataEntrySharedService.sendData(this.activeStepperStatus);
        }
      },
        (error: any) => {
        }
      );

    } else {
      this.formInvalid = true;
      this.formSubmitted=true;
      this.dataEntrySharedService.setErrorBorderColor(this.formSubmitted)
    }
  }

  onFormUpdate(){
    console.log("update function")
    console.log("application check 1", this.applicationFormValid)
    console.log("address check", this.addressFormValid)
    console.log("personal check", this.personalFormValid)
    console.log("loan check", this.loanFormValid)
    console.log("employment check", this.employmentFormValid)
    console.log("card details check", this.cardDetailsFormValid)
    console.log("evaluation check", this.evaluationFormValid)
    console.log("spouse check", this.spouseFormValid)
    console.log("personal ref check", this.personalRefFormValid)
    console.log("supplementary detail  check", this.supplementaryInfoForm.valid)

    if (this.applicationFormValid && this.addressFormValid && this.personalFormValid && this.employmentFormValid) {
      this.formInvalid = false;
      this.formSubmitted=false
      this.listFieldName.status = 'UI_INITIATED'
      this.listFieldName.initialStatus = 'UI_INITIATED'

      if (this.listFieldName) {
        if (this.listFieldName['appmAPLDat']) {
          this.listFieldName['appmAPLDat'] = this.listFieldName['appmAPLDat'].replace(/-/g, '');
        }
        if (this.listFieldName['appmCcris1']) {
          this.listFieldName['appmCcris1'] = this.listFieldName['appmCcris1'].replace(/-/g, '')
        }
        if (this.listFieldName['appmCcris2']) {
          this.listFieldName['appmCcris2'] = this.listFieldName['appmCcris2'].replace(/-/g, '')
        }
        if (this.listFieldName['appmCcris3']) {
          this.listFieldName['appmCcris3'] = this.listFieldName['appmCcris3'].replace(/-/g, '')
        }
        if (this.listFieldName['appmnFDate']) {
          this.listFieldName['appmnFDate'] = this.listFieldName['appmnFDate'].replace(/-/g, '')
        }
        if (this.listFieldName['appxCCRis4']) {
          this.listFieldName['appxCCRis4'] = this.listFieldName['appxCCRis4'].replace(/-/g, '')
        }
        if (this.listFieldName['appxCCRis5']) {
          this.listFieldName['appxCCRis5'] = this.listFieldName['appxCCRis5'].replace(/-/g, '')
        }
        if (this.listFieldName['appmDob']) {
          this.listFieldName['appmDob'] = this.listFieldName['appmDob'].replace(/-/g, '')
        }
        if (this.listFieldName['appmS1Dob']) {
          this.listFieldName['appmS1Dob'] = this.listFieldName['appmS1Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS2DOb']) {
          this.listFieldName['appmS2DOb'] = this.listFieldName['appmS2DOb'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS3DOb']) {
          this.listFieldName['appmS3DOb'] = this.listFieldName['appmS3DOb'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS4Dob']) {
          this.listFieldName['appmS4Dob'] = this.listFieldName['appmS4Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS5Dob']) {
          this.listFieldName['appmS5Dob'] = this.listFieldName['appmS5Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS6Dob']) {
          this.listFieldName['appmS6Dob'] = this.listFieldName['appmS6Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS7Dob']) {
          this.listFieldName['appmS7Dob'] = this.listFieldName['appmS7Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS8Dob']) {
          this.listFieldName['appmS8Dob'] = this.listFieldName['appmS8Dob'].replace(/-/g, '');
        }
        if (this.listFieldName['appmS9Dob']) {
          this.listFieldName['appmS9Dob'] = this.listFieldName['appmS9Dob'].replace(/-/g, '');
        }
      }
      console.log("listFieldName", this.listFieldName)
      this.loanService.updateDataEntryFields(this.listFieldName).subscribe(res => {
        if (res) {
          let url = this.currentURL;
          url = url.substring(0, url.lastIndexOf("/"));
          this.router.navigateByUrl(url + "/" + 'fileupload-step');
          this.activeStepperStatus = true;
          this.dataEntrySharedService.sendData(this.activeStepperStatus);
          this.dataEntrySharedService.resetConditionCheckForUpdate();
        }
      },
        (error: any) => {
        }
      );

    } else {
      this.formInvalid = true;
      this.formSubmitted=true;
      this.dataEntrySharedService.setErrorBorderColor(this.formSubmitted)
    }
  }

  setInput() {
    this.dataEntrySharedService.setInputValue(this.listFieldName);
  }

  getSubTabName() {
    this.subTabName = this.dataEntrySharedService.getSupplementarySubTabName();
  }

  dateFormatHanldle(){
    console.log("dateFormatHanldle")
    if(this.listFieldName['appmS1Dob']){
      const year = this.listFieldName['appmS1Dob'].substr(0, 4);
        const month = this.listFieldName['appmS1Dob'].substr(4, 2);
      const day = this.listFieldName['appmS1Dob'].substr(6, 2);
      this.listFieldName['appmS1Dob'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS2DOb']){
      const year = this.listFieldName['appmS2DOb'].substr(0, 4);
        const month = this.listFieldName['appmS2DOb'].substr(4, 2);
      const day = this.listFieldName['appmS2DOb'].substr(6, 2);
      this.listFieldName['appmS2DOb'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS3DOb']){
      const year = this.listFieldName['appmS3DOb'].substr(0, 4);
        const month = this.listFieldName['appmS3DOb'].substr(4, 2);
      const day = this.listFieldName['appmS3DOb'].substr(6, 2);
      this.listFieldName['appmS3DOb'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS4Dob']){
      const year = this.listFieldName['appmS4Dob'].substr(0, 4);
        const month = this.listFieldName['appmS4Dob'].substr(4, 2);
      const day = this.listFieldName['appmS4Dob'].substr(6, 2);
      this.listFieldName['appmS4Dob'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS5Dob']){
      const year = this.listFieldName['appmS5Dob'].substr(0, 4);
        const month = this.listFieldName['appmS5Dob'].substr(4, 2);
      const day = this.listFieldName['appmS5Dob'].substr(6, 2);
      this.listFieldName['appmS5Dob'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS6Dob']){
      const year = this.listFieldName['appmS6Dob'].substr(0, 4);
        const month = this.listFieldName['appmS6Dob'].substr(4, 2);
      const day = this.listFieldName['appmS6Dob'].substr(6, 2);
      this.listFieldName['appmS6Dob'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS7Dob']){
      const year = this.listFieldName['appmS7Dob'].substr(0, 4);
        const month = this.listFieldName['appmS7Dob'].substr(4, 2);
      const day = this.listFieldName['appmS7Dob'].substr(6, 2);
      this.listFieldName['appmS7Dob'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS8Dob']){
      const year = this.listFieldName['appmS8Dob'].substr(0, 4);
        const month = this.listFieldName['appmS8Dob'].substr(4, 2);
      const day = this.listFieldName['appmS8Dob'].substr(6, 2);
      this.listFieldName['appmS8Dob'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmS9Dob']){
      const year = this.listFieldName['appmS9Dob'].substr(0, 4);
        const month = this.listFieldName['appmS9Dob'].substr(4, 2);
      const day = this.listFieldName['appmS9Dob'].substr(6, 2);
      this.listFieldName['appmS9Dob'] = `${year}-${month}-${day}`
    }

  }

}
