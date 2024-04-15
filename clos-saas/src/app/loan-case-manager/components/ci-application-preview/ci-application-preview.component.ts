import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ci-application-preview',
  templateUrl: './ci-application-preview.component.html',
  styleUrls: ['./ci-application-preview.component.scss']
})
export class CiApplicationPreviewComponent implements OnInit {
  verificationList:string[]=['EMPLOYMENT VERIFICATION','RESIDENCE VERIFICATION','APPLICANT VERIFICATION','CALL OUT DETAILS'];
  selectedIndex:number = 0;
  selectedTabIndex:number = 0;
  selectedTabName:string[]= ['EV','RV','AV'];
  genders:string[] = ['Male','Female','Unknown'];
  status:string[] = ['Pending','Contacted','Uncontacted'];
  textDataList:any[] =[];
  textarea:string = '';
  constructor() { }

  ngOnInit(): void {
  }

  onAddTextBox(){
    this.textDataList.push(
      this.textarea = ''
    )
  }

}
