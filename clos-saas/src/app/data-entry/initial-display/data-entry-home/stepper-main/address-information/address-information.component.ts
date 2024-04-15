import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-address-information',
  templateUrl: './address-information.component.html',
  styleUrls: ['./address-information.component.scss']
})
export class AddressInformationComponent implements OnInit {

  @ViewChild('addressForm') addressForm!: NgForm;
  listFieldName: ColumnList = new ColumnList();
  inputValue: any;
  conditionCheck: boolean;
  errorBorderStatus:boolean;
  homeOwnerList:any[]=[{name:'Owned property with loans', value:'1'}, {name:'Owned property without loans', value:'2'}, {name:'Relatives property', value:'3'}, {name:'Rented property', value:'4'}, {name:'Other', value:'5'}]

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
    if (this.addressForm.valid) {
      this.conditionCheck = true
    } else {
      this.conditionCheck = false
    }
    this.dataEntrySharedService.setAddressFormValidity(this.conditionCheck);
  }

}
