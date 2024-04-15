import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { VariableLibrary } from '../../../../models/Variables';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { VariablelibTestService } from '../../../../services/variablelib-test.service';

@Component({
  selector: 'app-variable-lib-config',
  templateUrl: './variable-lib-config.component.html',
  styleUrls: ['./variable-lib-config.component.scss']
})
export class VariableLibConfigComponent implements OnInit {
  loading: boolean=false;

  constructor(
    public dialogRef: MatDialogRef<VariableLibConfigComponent>,
    private libraryTestService: VariablelibTestService,
    private selectedProject: DecisionEngineIdService,
  ) { }
  VariablesLib:VariableLibrary[]=[]
  selectedVariable: number;filteredColumns: any[] = [];
  searchText: string=""
  onSelectVariable: VariableLibrary = null as any;
  onSelectVariableString: string = '';  
  ngOnInit(): void {
    this.getVariablesList();

  }
  getVariablesList() {
    this.loading = true;
    this.libraryTestService.getVariableLibraryList(this.selectedProject.selectedProjectId).subscribe(
      (res)=>{
        console.log(res);
        this.VariablesLib = res;
    this.filteredColumns = res
    this.loading =false;
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  selectVariable(Variable: VariableLibrary) {
    this.selectedVariable = Variable.id;
    this.onSelectVariable = Variable;
  }
  oncancelClick() {
    this.dialogRef.close();

  }

  onSelectVariableClick() {
    this.onSelectVariableString = JSON.stringify(this.onSelectVariable);
    this.dialogRef.close(this.onSelectVariableString);
  }
  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.VariablesLib.length; i++) {
      if (this.VariablesLib[i].name != null) {
        if (this.VariablesLib[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.VariablesLib[i]);
        }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.VariablesLib
  }



}
