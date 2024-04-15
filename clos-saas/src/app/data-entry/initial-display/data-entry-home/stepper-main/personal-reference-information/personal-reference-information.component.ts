import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-personal-reference-information',
  templateUrl: './personal-reference-information.component.html',
  styleUrls: ['./personal-reference-information.component.scss']
})
export class PersonalReferenceInformationComponent implements OnInit {

  @ViewChild('personalRefInfoForm') personalRefInfoForm!: NgForm;

  inputValue:any
  conditionCheck:boolean
  listFieldName: ColumnList = new ColumnList();

  constructor(
    private dataEntrySharedService: DataEntrySharedService
  ) { }

  ngOnInit(): void {
    this.inputValue = this.dataEntrySharedService.getInputValue();
    if (this.inputValue) {
      this.listFieldName = this.inputValue
    }
  }

  setInput(){
    this.dataEntrySharedService.setInputValue(this.listFieldName);
  }

  ngOnDestroy(): void {
    if (this.personalRefInfoForm.valid) {
      this.conditionCheck=true
    } else {
      this.conditionCheck=false
    }
  
      this.dataEntrySharedService.setPersonalReferenceInfoFormValidity(this.conditionCheck);
  }

}
