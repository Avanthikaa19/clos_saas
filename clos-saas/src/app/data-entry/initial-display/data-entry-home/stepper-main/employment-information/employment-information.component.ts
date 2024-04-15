import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-employment-information',
  templateUrl: './employment-information.component.html',
  styleUrls: ['./employment-information.component.scss']
})
export class EmploymentInformationComponent implements OnInit {

  @ViewChild('employmentInfoForm') employmentInfoForm!: NgForm;
  listFieldName: ColumnList = new ColumnList();
  inputValue: any;
  conditionCheck: boolean;
  errorBorderStatus:boolean;
  employmentTypelIst:any[]=[{name:'Private sector',value:'1'}, {name:'Government', value:'2'}, {name:'Self employed', value:'3'}, {name:'Retired', value:'4'}]
  natureOfBusinessList:any[]=[{name:'Agricultural/Mining sector',value:'1'}, {name:'Banking',value:'2'}, {name:'Business/Commercial Services',value:'3'}, {name:' Community / Social / Personal',value:'4'}, {name:'Construction',value:'5'}, {name:'Financing',value:'6'}, {name:'Insurance',value:'7'}, {name:'Manufacturing',value:'8'}, {name:'Real Estate',value:'9'},
                               {name:'Transportation / Communication',value:'10'}, {name:'Utilities',value:'11'}, {name:'Wholesale / Retail',value:'12'}, {name:'Unemployed',value:'13'}, {name:'BPO',value:'14'}, {name:'Government',value:'15'}, {name:'Money Changers / Foreign Exchange Dealer',value:'16'}, {name:'Money Transmitters / Remittance Agents',value:'17'}, {name:'Pawnshop',value:'18'}, {name:' Cash Checking Facilities / Bayad Center',value:'19'}]
  occupationCodeList:any[]=[{name:'Administrator/ Executive',value:'01'}, {name:'Agricultural',value:'02'},  {name:'Armed Forces/ Military',value:'03'},  {name:'Clerical',value:'04'},  {name:'Product/ Transportation',value:'05'}, {name:'Professional/ Technical',value:'06'}, {name:'Sales Worker',value:'07'},
                             {name:'Service Worker',value:'08'}, {name:'Service Worker',value:'09'}, {name:'Self Employed',value:'10'}, {name:'Others',value:'11'}]
  positionList:any[]=[{name:'Clerk',value:'01'}, {name:'Officer-Junior / Supervisor',value:'02'}, {name:'Officer-Senior',value:'03'}, {name:'Executive',value:'04'}, {name:'Non-Officer(Lawer/ Teached)',value:'05'},
                       {name:'OCW',value:'06'}, {name:'Religious',value:'07'}, {name:'Retired',value:'08'}, {name:'Self-Employed/ Proprietor',value:'09'}, {name:'Others',value:'10'}]
  wealthList:any[]=[{name:'Employment',value:'EMP'}, {name:'Business',value:'BUSS'}, {name:'Retired',value:'RET'},  {name:'Allownace',value:'ALLO'}, {name:'Remittance',value:'REM'}, {name:'Others',value:'OTH'}]

  constructor(
    private dataEntrySharedService: DataEntrySharedService
  ) {
    this.errorBorderStatus=this.dataEntrySharedService.getErrorBorderColor()
   }

  ngOnInit(): void {
    this.inputValue = this.dataEntrySharedService.getInputValue();
    if (this.inputValue) {
      this.listFieldName = this.inputValue
    }
  }

  setInput() {
    this.dataEntrySharedService.setInputValue(this.listFieldName);
  }

  ngOnDestroy(): void {
    if (this.employmentInfoForm.valid) {
      this.conditionCheck = true
    } else {
      this.conditionCheck = false
    }
    this.dataEntrySharedService.setEmploymentInfoFormValidity(this.conditionCheck);
  }

}
