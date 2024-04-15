import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit {

  @ViewChild('loanDetailsInfoForm') loanDetailsInfoForm!: NgForm;
  listFieldName: ColumnList = new ColumnList();
  inputValue:any;
  conditionCheck:boolean;

  constructor(
    private dataEntrySharedService: DataEntrySharedService
  ) { }

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
    if (this.loanDetailsInfoForm.valid) {
      this.conditionCheck=true
    } else {
      this.conditionCheck=false
    }
  
      this.dataEntrySharedService.setLoanInfoFormValidity(this.conditionCheck);
  }

}
