import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DecisionTableList } from '../../../../models/DecisionTable';
import { DecisionTablesService } from '../../../../services/decision-tables.service';
import { UrlService } from '../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-decision-table-config',
  templateUrl: './decision-table-config.component.html',
  styleUrls: ['./decision-table-config.component.scss']
})
export class DecisionTableConfigComponent implements OnInit {

  filteredColumns: any[] = [];
  searchText: string = ""

  constructor(private decisionTableService: DecisionTablesService, public dialogRef: MatDialogRef<DecisionTableConfigComponent>, private url: UrlService,
    private selectedProject: DecisionEngineIdService
  ) { }
  tableList: DecisionTableList[] = []
  onSelectTable: DecisionTableList = null as any;
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

  selectTable(tableData: DecisionTableList) {
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
