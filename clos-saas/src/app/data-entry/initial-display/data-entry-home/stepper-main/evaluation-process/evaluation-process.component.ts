import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataEntrySharedService } from 'src/app/data-entry/data-entry-shared.service';
import { ColumnList } from '../../data-entry-home.component';

@Component({
  selector: 'app-evaluation-process',
  templateUrl: './evaluation-process.component.html',
  styleUrls: ['./evaluation-process.component.scss']
})
export class EvaluationProcessComponent implements OnInit {

  @ViewChild('evaluationInfoForm') evaluationInfoForm!: NgForm;
  inputValue: any;
  conditionCheck:boolean;
  listFieldName: ColumnList = new ColumnList();
  addressIndicatorList:any[]=[{name:'Home Address', value:'1'},{name:'Office Address', value:'2'},{name:'Alternate Address', value:'3'}, ]
  idTypelist:any[]=[{name:'ACR', value:'A'}, {name:'NBI Clearance/Police Clearance', value:'B'}, {name:'Senior Citizen Card', value:'C'}, {name:'Driver’s License', value:'D'}, {name:'Voter’s ID', value:'E'}, {name:'Company ID', value:'F'}, {name:'GSIS ID', value:'G'}, {name:'Philhealth', value:'H'}, {name:'Integrated Bar of the Philippines', value:'I'}, {name:'Student’s ID', value:'J'}, {name:'Philsys ID/National ID', value:'K'},
                   {name:'Postal ID', value:'L'}, {name:'Seaman’s Book', value:'M'}, {name:'National Council on Disability Affairs', value:'N'}, {name:'PRC ID', value:'O'}, {name:'Passport', value:'P'}, {name:'Pag-Ibig ID', value:'Q'},  {name:'Government and GOCCs IDs', value:'R'}, {name:'SSS ID', value:'S'},  {name:'TIN', value:'T'}, {name:'Unified ID', value:'U'}, {name:'Visa', value:'V'}, {name:'PWD ID', value:'W'}]

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
    if (this.evaluationInfoForm.valid) {
      this.conditionCheck=true
    } else {
      this.conditionCheck=false
    }
  
      this.dataEntrySharedService.setEvaluationInfoFormValidity(this.conditionCheck);
  }

}
