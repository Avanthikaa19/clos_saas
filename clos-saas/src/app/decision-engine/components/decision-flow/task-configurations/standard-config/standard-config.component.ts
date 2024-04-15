import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TlStandards } from '../../../../models/Standards';
import { DecisionTablesService } from '../../../../services/decision-tables.service';

@Component({
  selector: 'app-standard-config',
  templateUrl: './standard-config.component.html',
  styleUrls: ['./standard-config.component.scss']
})
export class StandardConfigComponent implements OnInit {

filteredColumns: any[] = [];
searchText: string=""
  
constructor(  public dialogRef: MatDialogRef<StandardConfigComponent>,private standardService: DecisionTablesService,
  ) { }
standardList:any[]=[]
onSelectStandard: TlStandards = null as any;
onSelectStandardString: string = '';
selectedStandard: number;
loading: boolean = false;

async ngOnInit() {
  this.getStandardList();
}

getStandardList() {
  this.loading=true;
  this.standardService.getstandardstable().subscribe(
    (      res: any) => {
      console.log(res);
      this.standardList = res;
      this.filteredColumns=res;
  this.loading=false;

    }
  )
}

  selectStandard(standardData:any){
    this.selectedStandard = standardData.id;
    this.onSelectStandard = standardData;

  }
  onSelectStandardClick(){
    this.onSelectStandardString = JSON.stringify(this.onSelectStandard);
    this.dialogRef.close(this.onSelectStandardString);
  }
  oncancelClick(){
    this.dialogRef.close();
  }

  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.standardList.length; i++) {
      if (this.standardList[i].name != null) {
        if (this.standardList[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.standardList[i]);
        }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.standardList
  }

}
