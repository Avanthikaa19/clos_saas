import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {

  @ViewChild('cardDetailsInfoForm') cardDetailsInfoForm!: NgForm;
  inputValue: any;
  conditionCheck: boolean;
  listFieldName: ColumnList = new ColumnList();
  conditonForUpdate:boolean;

  constructor(
    private dataEntrySharedService: DataEntrySharedService
  ) {
    this.conditonForUpdate = this.dataEntrySharedService.getConditionCheckForUpdate();
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
    if (this.cardDetailsInfoForm.valid) {
      this.conditionCheck = true
    } else {
      this.conditionCheck = false
    }
    this.dataEntrySharedService.setCardDetailsInfoFormValidity(this.conditionCheck);
  }

  dateFormatHanldle(){
    console.log("dateFormatHanldle")
    if(this.listFieldName['appmCcris1']){
      const year = this.listFieldName['appmCcris1'].substr(0, 4);
        const month = this.listFieldName['appmCcris1'].substr(4, 2);
      const day = this.listFieldName['appmCcris1'].substr(6, 2);
      this.listFieldName['appmCcris1'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmCcris2']){
      const year = this.listFieldName['appmCcris2'].substr(0, 4);
        const month = this.listFieldName['appmCcris2'].substr(4, 2);
      const day = this.listFieldName['appmCcris2'].substr(6, 2);
      this.listFieldName['appmCcris2'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmCcris3']){
      const year = this.listFieldName['appmCcris3'].substr(0, 4);
        const month = this.listFieldName['appmCcris3'].substr(4, 2);
      const day = this.listFieldName['appmCcris3'].substr(6, 2);
      this.listFieldName['appmCcris3'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appmnFDate']){
      const year = this.listFieldName['appmnFDate'].substr(0, 4);
        const month = this.listFieldName['appmnFDate'].substr(4, 2);
      const day = this.listFieldName['appmnFDate'].substr(6, 2);
      this.listFieldName['appmnFDate'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appxCCRis4']){
      const year = this.listFieldName['appxCCRis4'].substr(0, 4);
        const month = this.listFieldName['appxCCRis4'].substr(4, 2);
      const day = this.listFieldName['appxCCRis4'].substr(6, 2);
      this.listFieldName['appxCCRis4'] = `${year}-${month}-${day}`
    }
    if(this.listFieldName['appxCCRis5']){
      const year = this.listFieldName['appxCCRis5'].substr(0, 4);
        const month = this.listFieldName['appxCCRis5'].substr(4, 2);
      const day = this.listFieldName['appxCCRis5'].substr(6, 2);
      this.listFieldName['appxCCRis5'] = `${year}-${month}-${day}`
    }
  }

}
