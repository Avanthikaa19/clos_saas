import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UrlService } from '../../../services/http/url.service';
import { fadeInOut } from 'src/app/app.animations';
import { VariablesService } from '../services/variables.service';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { AccessControlData } from 'src/app/app.access';

// import { CreateEditVariableComponent } from './models/create-edit-variable/create-edit-variable.component';
// import { PythonEditorComponent } from './models/python-editor/python-editor.component';


@Component({
  selector: 'app-list-variables',
  templateUrl: './list-variables.component.html',
  styleUrls: ['./list-variables.component.scss'],
  animations: [fadeInOut]
})
export class ListVariablesComponent implements OnInit {

  pageData: PageData;
  inputText: string;
  projectId: number = null as any;
  tableHeaders: string[] = [];
  variables: any[] = [];
  filterList: any[] = [];
  fetchedData: number = 0;
  loading: boolean = false;
  noAccess:boolean = false;
  inputData:boolean=false;
  // sortFields: Sorting[] = [
  //   {
  //     valueString: "id",
  //     displayName: "ID - Ascending"
  //   },
  //   {
  //     valueString: "-id",
  //     displayName: "ID - Descending"
  //   },
  //   {
  //     valueString: "name",
  //     displayName: "Name - Ascending"
  //   },
  //   {
  //     valueString: "-name",
  //     displayName: "Name - Descending"
  //   },
  //   {
  //     valueString: "type",
  //     displayName: "Type - Ascending"
  //   },
  //   {
  //     valueString: "-type",
  //     displayName: "Type - Descending"
  //   },
  //   {
  //     valueString: "tags",
  //     displayName: "Tag - Ascending"
  //   },
  //   {
  //     valueString: "-tags",
  //     displayName: "Tag - Descending"
  //   },
  //   {
  //     valueString: "in_use",
  //     displayName: "In_use - Ascending"
  //   },
  //   {
  //     valueString: "-in_use",
  //     displayName: "In_use - Descending"
  //   },
  //   {
  //     valueString: "source",
  //     displayName: "Source - Ascending"
  //   },
  //   {
  //     valueString: "-source",
  //     displayName: "Source - Descending"
  //   },
  //   {
  //     valueString: "database_mode",
  //     displayName: "Database_mode - Ascending"
  //   },
  //   {
  //     valueString: "-database_mode",
  //     displayName: "Database_mode - Descending"
  //   }
  // ]

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

  constructor(public dialog: MatDialog,
    private url: UrlService,
    private variableService: VariablesService,
    private router: Router,
    public ac:AccessControlData,
    // private selectedProject: ProjectIdService,
    private notifierService: NotifierService) {
    // INITIALIZING PAGEDATA
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
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
    this.projectId = this.variableService.selectedProjectId;
    this.getVariableList();
  }

  getVariableList() {
    this.loading = true;
    this.inputData= false;
    this.variableService.getVariables(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        console.log(res)
        this.loading = false;
        this.variables = res['output'];
        this.filterList = res['output'];
        this.pageData.totalRecords = res['total_items'];
        // this.fetchedData = res.count;
        // this.totalRecords = res.count;
        if (this.variables.length != 0) {
          this.tableHeaders = Object.keys(this.variables[0]);
          this.tableHeaders.pop();
          this.tableHeaders.pop();
          this.tableHeaders.pop();
          this.tableHeaders.push('action');

        }
        // if (this.fetchedData > this.pageSize) {
        //   this.totalPages = Math.ceil(this.fetchedData / this.pageSize);
        // } else {
        //   this.totalPages = 1;
        // }
        // this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        // this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
        if (this.variables.length == 0) {
          this.showNotification('default', 'No Data Found.')
        } else {
          this.showNotification('default', 'Variables Loaded Successfully.')
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
    this.variableService.saveUpdate = false;
    this.varId = 0;
    this.createRuleNav();

  }

  editVariable(varField: any) {
    this.variableService.saveUpdate = true;
    console.log(varField.id)
    this.varId = varField.id;
    this.createRuleNav();

  }

  createRuleNav() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/variableView/' + this.varId;
    this.router.navigateByUrl(viewUrl);
  }
  deleteVariable(varField: any) {
    let confirmation = confirm("Are you Sure to delete variable");
    console.log('conformation', confirmation)
    this.loading = true;
    if (confirmation == true) {
      this.variableService.deleteVariable(varField.id).subscribe(result => {
        console.log("deleted", result)
        setTimeout(() => {
          this.getVariableList();
        }, 4000);
        this.showNotification('default', 'Variables deleted successfully.');
      })
    } else {
      this.loading = false;
      console.log("cant delete")
    }

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
  searchVariables() {
    this.loading = true;
    if (this.inputText != "") {
      this.variableService.getSearchVariable(this.inputText).subscribe((res) => {
        this.loading = false;
        this.inputData= true;
        const searchArray = Object.assign([], res['data']);
        this.variables = searchArray
        this.pageData.totalRecords = res['total_items'];
        this.filterList = searchArray.reverse()
        if (this.variables.length == 0) {
          this.showNotification('default', "No Data Found.");
        } else {
          this.showNotification('default', "Query Variables Loaded Successfully.");
        }
      })
    }
    else if ((this.inputText == "")) {
          this.loading = false;
          this.inputText = '';
          setTimeout(() => {
            this.getVariableList()
          }, 4000);
        }
  }

  sortAsc() {
    this.variables.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    })
  }
  sortDesc() {
    this.variables.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }).reverse()
  }
  clearSearchField() {
    this.inputText = '';
    this.inputData= false;
    this.getVariableList()
  }

  // CHANGING PAGINATION EVENT
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('variableID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getVariableList();
  }
}
