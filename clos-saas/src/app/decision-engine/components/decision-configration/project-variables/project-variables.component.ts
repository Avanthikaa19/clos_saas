import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Sorting, Variables } from '../../../models/Variables';
import { UrlService } from '../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { VariablesService } from '../../../services/variables.service';

import { CreateEditVariableComponent } from './modals/create-edit-variable/create-edit-variable.component';
import { PythonEditorComponent } from './modals/python-editor/python-editor.component';

@Component({
  selector: 'app-project-variables',
  templateUrl: './project-variables.component.html',
  styleUrls: ['./project-variables.component.scss']
})
export class ProjectVariablesComponent implements OnInit {

  projectId: number = null as any;
  tableHeaders: string[] = [];
  variables: any[] = [];
  fetchedData: number = 0;

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
    {
      valueString: "type",
      displayName: "Type - Ascending"
    },
    {
      valueString: "-type",
      displayName: "Type - Descending"
    },
    {
      valueString: "tags",
      displayName: "Tag - Ascending"
    },
    {
      valueString: "-tags",
      displayName: "Tag - Descending"
    },
    {
      valueString: "in_use",
      displayName: "In_use - Ascending"
    },
    {
      valueString: "-in_use",
      displayName: "In_use - Descending"
    },
    {
      valueString: "source",
      displayName: "Source - Ascending"
    },
    {
      valueString: "-source",
      displayName: "Source - Descending"
    },
    {
      valueString: "database_mode",
      displayName: "Database_mode - Ascending"
    },
    {
      valueString: "-database_mode",
      displayName: "Database_mode - Descending"
    }
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

  constructor(public dialog: MatDialog,
    private url: UrlService,
    private variableService: VariablesService,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService) { }

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
    this.getVariableList();
  }

  openPythonEditor() {
    const dialogRef = this.dialog.open(PythonEditorComponent, {
      height: "80vh",
      width: "70vw",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getVariableList() {
    this.variableService.getVariables().subscribe(
        res => {
          console.log(res)
          this.variables = res;
          // this.fetchedData = res;
          // this.totalRecords = res;
          if (this.variables.length != 0) {
            this.tableHeaders = Object.keys(this.variables[0]);
            this.tableHeaders.pop();
            this.tableHeaders.pop();
            this.tableHeaders.pop();
            this.tableHeaders.push('action');

          }
          if (this.fetchedData > this.pageSize) {
            this.totalPages = Math.ceil(this.fetchedData / this.pageSize);
          } else {
            this.totalPages = 1;
          }
          this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
          this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
          if (this.variables.length == 0) {
            this.showNotification('default', 'No Data Found.')
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
    this.editVariable(new Variables());
  }

  editVariable(varField: any) {
    const dialogRef = this.dialog.open(CreateEditVariableComponent, {
      height: '55vh',
      width: '52vw',
      data: { variableFields: varField },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getVariableList();
    });
  }


  deleteVariable(varField: any) {
    console.log("variable", varField)
    let confirmation = confirm("Are you Sure to delete variable");
    if (confirmation == true) {
      this.variableService.deleteVariable(varField.id).subscribe(result => {
        console.log("deleted", result)
        this.getVariableList();
      })
    } else {
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
}
