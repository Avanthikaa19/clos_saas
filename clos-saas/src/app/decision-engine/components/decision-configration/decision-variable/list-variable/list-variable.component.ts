import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Sorting } from '../../../../models/Variables';
import { UrlService } from '../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { ProfileVariableService } from '../../../../services/profile-variable.service';


@Component({
  selector: 'app-list-variable',
  templateUrl: './list-variable.component.html',
  styleUrls: ['./list-variable.component.scss']
})
export class ListVariableComponent implements OnInit {
  projectId: number = null as any;
  tableHeaders: string[] = [];
  variables: any[] = [];
  fetchedData: number = 0;
loading: boolean =false
  sortFields: Sorting[] = [
    {
      valueString: "id",
      displayName: "ID - Ascending"
    },
    {
      valueString: "-id",
      displayName: "ID - Descending"
    },
    {
      valueString: "name",
      displayName: "Name - Ascending"
    },
    {
      valueString: "-name",
      displayName: "Name - Descending"
    },
  ]

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
    private selectedProject: DecisionEngineIdService,
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
    this.projectId = this.selectedProject.selectedProjectId;
    // this.getProjectName()
    this.getVariableList();

  }

  goBack() {
    let viewUrl = "/home/p/config" 
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
        res => {
          console.log("res",res)
          this.loading=false;

          // this.variables = res;
          // this.fetchedData = res.count;
          // this.totalRecords = res.count;
          if (this.variables) {
            // this.tableHeaders = Object.keys(this.variables[0]);
            console.log(this.tableHeaders)
            // this.tableHeaders.pop();
            // this.tableHeaders.pop();
            // this.tableHeaders.pop();
            // this.tableHeaders.push('action');
            this.tableHeaders=[ 'name','description',"action"]
            console.log(this.tableHeaders)


          }
          if (this.fetchedData > this.pageSize) {
            this.totalPages = Math.ceil(this.fetchedData / this.pageSize);
          } else {
            this.totalPages = 1;
          }
          this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
          this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
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

  getType(fieldName: string) {
    if (fieldName === 'others') {
      return 'others';
    }
    if (fieldName === 'action') {
      return 'action';
    }
    return 'default';
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
  onClearFilter() {
    this.id = null as any;
    this.name = '';
    this.type = '';
    this.tag = '';
    this.in_use = '';
    this.source = '';
    this.db_mode = '';
    this.getVariableList();
  }

  prevPage() {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.getVariableList();
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.getVariableList();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}
