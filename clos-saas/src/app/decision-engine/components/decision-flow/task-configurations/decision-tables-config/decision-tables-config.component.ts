import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DecisionTablesList } from '../../../../models/DecisionTables';
import { DecisionTablesService } from '../../../../services/decision-tables.service';
import { UrlService } from '../../../../services/http/url.service';

@Component({
  selector: 'app-decision-tables-config',
  templateUrl: './decision-tables-config.component.html',
  styleUrls: ['./decision-tables-config.component.scss']
})
export class DecisionTablesConfigComponent implements OnInit {
  filteredColumns: any[] = [];
  searchText: string = ""

  constructor(private decisionTableService: DecisionTablesService, public dialogRef: MatDialogRef<DecisionTablesConfigComponent>, private url: UrlService,
  ) { }
  tableList: DecisionTablesList[] = []
  onSelectTable: DecisionTablesList = null as any;
  onSelectTableString: string = '';
  selectedTable: number;
  loading: boolean = false;
  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    this.getTableList();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }

  }

  getTableList() {
    this.loading = true;
    this.decisionTableService.getTableList().subscribe(
      (res: any) => {
        this.tableList = res;
        this.filteredColumns = res;
        this.loading = false;
      }
    )
  }

  selectTable(tableData: DecisionTablesList) {
    this.selectedTable = tableData.id;
    this.onSelectTable = tableData;

  }
  onSelectTableClick() {
    this.onSelectTableString = JSON.stringify(this.onSelectTable);
    this.dialogRef.close(this.onSelectTableString);
  }
  oncancelClick() {
    this.dialogRef.close();
  }

  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.tableList.length; i++) {
      if (this.tableList[i].name != null) {
        if (this.tableList[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.tableList[i]);
        }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.tableList
  }

}
