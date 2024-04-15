import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicantDetail, ApplicationObject, InitialDataCapture } from './component/loan-processes/model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  loanProcess: any[] = [];
  currentApplication: any;
  loanScoreCard: any[] = [];
  data: ApplicantDetail= new ApplicantDetail(null,'','',null,null,'',null,null,'',false);
  // loanJson = {
  //   loanType:'',
  //   collateralType:[]
  // }
  applicationObject: ApplicationObject = new ApplicationObject(new InitialDataCapture(null,null,null,null,null,null,null,null,null,null,null),null,null);

  constructor(
    private http: HttpClient
  ) { }

}
