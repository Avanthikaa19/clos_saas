import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-application-information',
  templateUrl: './application-information.component.html',
  styleUrls: ['./application-information.component.scss']
})
export class ApplicationInformationComponent implements OnInit {

  listFieldName: ColumnList = new ColumnList();
  @ViewChild('applicationForm') applicationForm!: NgForm;
  inputValue: any;
  conditionCheck: boolean;
  createEditOption:string;
  listValue:any[]
  listKey:any[];
  conditionCheckForUpdate:boolean;
  productTypeList:string[]=['100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '200', '201', '203', '204', '205', '206', '207', '208','208', '210', '211', '213','214', '215', '216', '217', '302', '303', '304', '305',  '402', '403', '404', '405', '408', '409', '410', '411' ,'804']
  minDate: string;
  maxDate: string;
  errorBorderStatus:boolean
  todayDate: string;

  constructor(
    private dataEntrySharedService: DataEntrySharedService,
    private dataEntryService: LoanServiceService,
    private datePipe: DatePipe
  ) {
    this.dataEntrySharedService.createEditSelect.subscribe(data => {
      this.createEditOption = data;
    });
    this.createEditOption=this.dataEntrySharedService.getMatSelectOption();
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0];
    this.maxDate = currentDate.toISOString().split('T')[0];
    this.errorBorderStatus=this.dataEntrySharedService.getErrorBorderColor()
    this.todayDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.listFieldName['appmAPLDat']=this.todayDate
   }

  ngOnInit(): void {
    this.inputValue = this.dataEntrySharedService.getInputValue();
    if (this.inputValue) {
      this.listFieldName = this.inputValue
    }
    this.setInput()
  }
  setInput() {
    this.dataEntrySharedService.setInputValue(this.listFieldName);
    console.log("call")
  }

  ngOnDestroy(): void {
    if (this.applicationForm.valid) {
      this.conditionCheck = true
    } else {
      this.conditionCheck = false
    }
    this.dataEntrySharedService.setApplicationFormValidity(this.conditionCheck);
  }
  onEnterPressed(event, id:number){
    console.log("event", event)
    console.log("listFieldName.id", id)
    this.dataEntryService.getDataEntryVaueById(id).subscribe(res => {
      if(res){
        console.log("response", res)
        Object.keys(res).forEach((key) => {
          this.listFieldName[key] = res[key];
        });
        if(this.listFieldName['appmAPLDat']){
          console.log("listFieldName['appmPdtnbr']", this.listFieldName['appmPdtnbr'])
          const year = this.listFieldName['appmAPLDat'].substr(0, 4);
          const month = this.listFieldName['appmAPLDat'].substr(4, 2);
        const day = this.listFieldName['appmAPLDat'].substr(6, 2);
        this.listFieldName['appmAPLDat'] = `${year}-${month}-${day}`
        }
        
        this.conditionCheckForUpdate =true;
        this.dataEntrySharedService.setConditionCheckForUpdate(this.conditionCheckForUpdate)
        this.dataEntrySharedService.setId(this.listFieldName.id)
      }
    })
    this.setInput()
  }

}
