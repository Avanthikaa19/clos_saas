import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Sorting } from '../../../models/Variables';
import { UrlService } from '../../../services/http/url.service';
import { ProfileVariableService } from '../../../services/profile-variable.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';

@Component({
  selector: 'app-list-profiling',
  templateUrl: './list-profiling.component.html',
  styleUrls: ['./list-profiling.component.scss']
})
export class ListProfilingComponent implements OnInit {

  projectId: number = null as any;
  tableHeaders: string[] = [];
  variables: any[] = [];
  fetchedData: number = 0;
loading: boolean =false
  
  

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 1;
  totalRecords: number = 0;
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  // Filters
  id: number = null as any;
  name: string = '';
  type: string = '';
  tag: string = '';
  in_use: string = '';
  source: string = '';
  db_mode: string = '';
  searchField: string = '';
  sortField: string = '-id';
  varId: number = 0;
  projectName: any;
  inputText:string;

  constructor(public dialog: MatDialog,
    private url: UrlService,
    private profileService: ProfileVariableService,
    private router: Router,
    private notifierService: NotifierService) {

     }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.getVariableList();

  }

  goBack() {
    let viewUrl = "/alert-config/home/p/config" 
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }
 
  searchTable() {
    if (this.inputText != "") {
      this.variables = this.variables.filter(res => {
        return res.name.toLocaleLowerCase().match(this.inputText.toLocaleLowerCase().trim())
      })
    }
    else if((this.inputText == "")){
      this.variables = this.variables
    }
  
  }
  getVariableList() {
    this.loading= true;
    this.profileService.getProfiles().subscribe(
        (res:any) => {
          console.log(res)
          this.loading=false;

          this.variables = res;
         
          if (this.variables.length == 0) {
            this.showNotification('default', 'No Profiling Variables Found.')
          } else {
            this.showNotification('default', 'Loaded Successfully.')
          }
        },
        (err) => {
          this.showNotification('error', 'Oops! Something went wrong.')
        }
      )
  }

  

  createNewVariable() {
    // this.editVariable(new Variables());
    this.varId=0;
    this.createRuleNav();

  }

  editVariable(varField: any) {
    console.log(varField.id)
    this.varId=varField.id;
    this.createRuleNav();
   
  }

  createRuleNav(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/profileView/' + this.varId;
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl);
}
  deleteVariable(varField: any) {
    console.log("variable", varField)
    let confirmation = confirm("Are you Sure to delete Profiling");
    if (confirmation == true) {
    this.loading= true;
      this.profileService.deleteProfile(varField.id).subscribe(result => {
        console.log("deleted", result)
    this.showNotification('default', 'Deleted Successfully.')
        this.getVariableList();
    this.loading=false;
      })
    } else {
    this.showNotification('default', 'Deletion cancelled')
      console.log("cant delete")
    }

  }
  sortAsc(){
    this.variables.sort(function(a,b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  })
  }
  sortDesc(){
    this.variables.sort((a,b) => a.name < b.name ? 1 : -1)
  }
 
 
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}
