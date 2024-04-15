import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Inprogress, Loancase } from '../models/loancase';
import { ApplicationObject} from '../../loan-origination/component/loan-processes/model';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { selfassign } from '../components/self-claim/self-claim.component';

@Injectable({
  providedIn: 'root'
})
export class LoanCaseManagerServiceService {

  API_URL: string = '';
  API_URL_DATA: string = '';
  opencalculator: boolean = false;
  emiCalculator: boolean = false;
  notepad: boolean = false;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.clos_data_service;
    this.API_URL_DATA = this.configurationService.apiUrl().services.domain_data_service;
   }
   
   // LOAN CASE MANAGER API'S

   // Case Management APi
   getVerificationQueue(pageNum: number,pageSize: number,verificationStatus: string,loanCase: Loancase) {
    return this.http.post<Loancase>(`${this.API_URL}/dataentry/casemanagement/getall-initialdata?pageNum=${pageNum}&pageSize=${pageSize}&verificationStatus=${verificationStatus}`,loanCase);
   }

   // Assignee Dropdown
   getAssignee() {
    return this.http.get(`${this.API_URL_DATA}/domain/roles/supervisitinguser/dropdown`);
   }

   // Self Claim
   selfClaim(appId: string) {
    return this.http.get(`${this.API_URL}/dataentry/set/verificationstatus?applicationId=${appId}`)
   }

   // Get Full Information of the Applicant Based On application id
   getDetails(id: string) {
    return this.http.get(`${this.API_URL}/dataentry/getApplicationInfo/${id}`)
   }

   // Verified
   getVerify(appId: string) {
    return this.http.post(`${this.API_URL}/dataentry/set/verifiedStatus?applicationId=${appId}`,{responseType: 'text'})
   }

   // Underwrite Dropdown
   getDropdown() {
    return this.http.get(`${this.API_URL_DATA}/domain/users/underwriter/dropdown`)
   }

   // Update Assignee
   updateAssignee(appId: string,assign: string,inprogress: Inprogress) {
    return this.http.post<Inprogress>(`${this.API_URL}/dataentry/set/status/verifierinprogress?applicationId=${appId}&assignedTo=${assign}`,inprogress, { responseType: 'text' as 'json'})
   }

   // Update Assignee
   updateUnderwriterAssignee(appId: string,assign: string,inprogress: Inprogress) {
    return this.http.post<Inprogress>(`${this.API_URL}/dataentry/set/status/underwriterinprogress?applicationId=${appId}&assignedTo=${assign}`,inprogress, { responseType: 'text' as 'json'})
   }

   // Credit Decision
   getCredit(appId: string,creditDecision: string,amountGranted: number) {
    return this.http.get(`${this.API_URL}/dataentry/set/underwriterStatus?applicationId=${appId}&creditDecision=${creditDecision}&amountGranted=${amountGranted}`)
   }

   // Duplicate List
   getDuplicate(response) {
    return this.http.post(`${this.API_URL}/findDuplicates/`,response, { responseType: 'json'})
   }

   // Find Duplicate 
   getFindDuplicate(id: number) {
    return this.http.get(`${this.API_URL}/dataentry//get-application-data/${id}`);
   }

   selfAssignee(id: number) {
    return this.http.get(`${this.API_URL}/dataentry/edit/selfassignee?applicationId=${id}`);
   }

   // Documentation
   getDocs(id: string) {
    return this.http.get(`${this.API_URL}/documentations/getDocumentationsForVerification?applicationId=${id}`);
   }

   //Accepted Edit
   getAcceptEdit(id: string) {
    return this.http.get(`${this.API_URL}/dataentry/get/underwriterdetails?applicationId=${id}`);
   }

 //Accepted Edit update
 getAcceptEditUpdate(id: string,creditDecision:string,amountGranted :string) {
  return this.http.get(`${this.API_URL}/dataentry/set/underwriterStatus?applicationId=${id}&creditDecision=${creditDecision}&amountGranted=${amountGranted}`)
 }

  //Self Claim Underwriter Progress
  selfclaimUnderwriter(id: string){
    return this.http.get(`${this.API_URL}/dataentry/underwriter/selfclaim?applicationId=${id}`);
  }
// FIELDS NAME API  
getFieldsName() {
  return this.http.get<any[]>(`${this.API_URL}/case-management/field`)
}

 // INTERNAL SCORING LISTING API (USING COLUMN DEFINITIOS)
 getList(columns: ColumnDefinition[], page: number, pageSize: number,status:string, isView: boolean,tab:string) {
  return this.http.post(`${this.API_URL}/case-management/duplicate/applications?page=${page}&pageSize=${pageSize}&status=${status}&isView=${isView}&tab=${tab}`, columns);
}

//INTERNAL SCORING  LISTING SCREEN EXPORT APIS
// EXPORT API  (1) 
internalScoringListExport(columns: ColumnDefinition[],format:string,status:string,stageName:string) {
  return this.http.post<any>(`${this.API_URL}/case-management/export/?format=${format}&status=${status}&tab=${stageName}`, columns);
}
// EXPORT GET JOB API (2)
getJob(id: number) {
  return this.http.get<DownloadJob>(`${this.API_URL}/jobs/${id}`);
}
// EXPORT GET FILE API (3)
getFileByJob(id: number) {
  return this.http.get(`${this.API_URL}/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
}

selfAssign(selfassign:selfassign) {
  return this.http.put(`${this.API_URL}/case-manager/assign`, selfassign);
}


}



