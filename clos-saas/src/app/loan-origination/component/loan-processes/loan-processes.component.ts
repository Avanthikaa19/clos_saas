import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-loan-processes',
  templateUrl: './loan-processes.component.html',
  styleUrls: ['./loan-processes.component.scss']
})
export class LoanProcessesComponent implements OnInit {

  loanOrigination: any[] = [
    {step: '01', name: 'INITIAL DATA CAPTURE',abbr:'QDC', description:'', icon:'quickreply' , route: 'process/1'},
    {step: '02', name: 'FULL DATA CAPTURE',abbr:'FDC', description:'', icon:'fact_check' , route: 'process/2'},
    // {step: '03', name: 'CREDIT BUREAU',abbr:'NAPU', description:'', icon:'card_membership' , route: 'process/3'},
    // {step: '04', name: 'LOAN STIMULATOR',abbr:'LS', description:'', icon:'admin_panel_settings' , route: 'process/4'},
    // {step: '04', name: 'ACCOUNT OFFICER',abbr:'AO', description:'', icon:'admin_panel_settings' , route: 'process/4'},
    // {step: '05', name: 'CREDIT OFFICER',abbr:'CO', description:'', icon:'contact_mail' , route: 'process/5'},
    // {step: '06', name: 'CREDIT INVESTIGATION',abbr:'CI', description:'', icon:'policy' , route: 'process/6'},
    // {step: '04', name: 'CREDIT ANALYST',abbr:'CA', description:'', icon:'query_stats' , route: 'process/7'},
    // {step: '05', name: 'LOAN BOOKING DETAILS',abbr:'RFB', description:'', icon:'auto_stories' , route: 'process/8'},
    // {step: '09', name: 'CUSTOMER CARE UNIT',abbr:'CCU', description:'', icon:'support_agent' , route: 'process/9'},
    // {step: '10', name: 'LEGAL & OPERATION',abbr:'LAD', description:'', icon:'room_preferences' , route: 'process/10'},
    {step: '03', name: 'DOCUMENTATIONS',abbr:'LOD', description:'', icon:'receipt_long' , route: 'process/11'},
  ];
  loanProcess: any[]=[];
  isExpanded : boolean = false;

  constructor(public loanService: ServiceService,
    public encryptDecryptService:EncryptDecryptService,) {}

  ngOnInit(): void {
    this.decreptAppId();
  }

  decreptAppId(){
    if(sessionStorage.getItem('CURR_APPLICATION_ID')){
    let appID = sessionStorage.getItem('CURR_APPLICATION_ID');
      let encryptAccess=this.encryptDecryptService.decryptData(appID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
      this.loanService.applicationObject.initialData.id = encryptAccess;
    }
  }
}
