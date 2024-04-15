import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-spouse-information',
  templateUrl: './spouse-information.component.html',
  styleUrls: ['./spouse-information.component.scss']
})
export class SpouseInformationComponent implements OnInit {

  @ViewChild('spouseInfoForm') spouseInfoForm!: NgForm;
  inputValue:any;
  conditionCheck:boolean;
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
    if (this.spouseInfoForm.valid) {
      this.conditionCheck=true
    } else {
      this.conditionCheck=false
    }
  
      this.dataEntrySharedService.setSpouselInfoFormValidity(this.conditionCheck);
  }

}
