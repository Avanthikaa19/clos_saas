import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  @ViewChild('personalInfoForm') personalInfoForm!: NgForm;
  listFieldName: ColumnList = new ColumnList();
  inputValue:any;
  conditionCheck:boolean;
  conditonForUpdate:boolean;
  errorBorderStatus:boolean;
  genderList:any[]=[{name:'Male', value:'0'},{name:'Female', value:'1'}, {name:'Unknown', value:'2'}]
  maritalList:any[]=[{name:'Single', value:'0'}, {name:'Married', value:'1'}, {name:'Divorce', value:'2'}, {name:'Widow', value:'3'}]
  educationList:any[]=[{name:'High School', value:'1'}, {name:'College', value:'2'},{name:'Some College', value:'3'}, {name:'Post Graduate', value:'4'}, {name:'Others', value:'5'}]

  constructor(
    private dataEntrySharedService: DataEntrySharedService
  ) {
    this.conditonForUpdate = this.dataEntrySharedService.getConditionCheckForUpdate();
    this.errorBorderStatus=this.dataEntrySharedService.getErrorBorderColor()
   }

  ngOnInit(): void {
    this.inputValue = this.dataEntrySharedService.getInputValue();
    if (this.inputValue) {
      this.listFieldName = this.inputValue
    }
    if(this.conditonForUpdate){
      this.dateFormatHanldle()
    }
  }

  setInput() {
    this.dataEntrySharedService.setInputValue(this.listFieldName);
  }

  ngOnDestroy(): void {
    if (this.personalInfoForm.valid) {
      this.conditionCheck=true
    } else {
      this.conditionCheck=false
    }
  
      this.dataEntrySharedService.setPersonalInfoFormValidity(this.conditionCheck);
  }

  dateFormatHanldle(){
    console.log("dateFormatHanldle")
    if(this.listFieldName['appmDob']){
      const year = this.listFieldName['appmDob'].substr(0, 4);
        const month = this.listFieldName['appmDob'].substr(4, 2);
      const day = this.listFieldName['appmDob'].substr(6, 2);
      this.listFieldName['appmDob'] = `${year}-${month}-${day}`
    }
  }

}
