import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DecisionTreesService } from '../../../../services/decision-trees.service';
import { UrlService } from '../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-decision-tree-configuration',
  templateUrl: './decision-tree-configuration.component.html',
  styleUrls: ['./decision-tree-configuration.component.scss']
})
export class DecisionTreeConfigurationComponent implements OnInit {

  screenHeight: number = 0;
  screenWidth: number = 0;
  selectedTree:  number = 0;
  onSelectTree: DecisionTreeData = null as any;
  onSelectTreeString: string = '';
loading: boolean = false;
  decisionTree: DecisionTreeData[] = [ ];
  filteredColumns: DecisionTreeData[] = [];
  searchText: string=""
    
  constructor(
    private url: UrlService,
    private selectedProject: DecisionEngineIdService,
    private decisionTreeService: DecisionTreesService,
    public dialogRef: MatDialogRef<DecisionTreeConfigurationComponent>,
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 330;
    this.screenWidth = window.innerWidth;
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    this.getTreeList();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
   
    console.log('Selected Project Id',this.selectedProject.selectedProjectId)
  }
  
    getTreeList() {
      this.loading=true;
      this.decisionTreeService.getListOfTree().subscribe(
        (      res: any) => {
          console.log(res);
          this.decisionTree = res;
          this.filteredColumns =res;
      this.loading=false;

        }
      )
    }

  selectTree(treeData: DecisionTreeData) {
    this.selectedTree = treeData.id;
    this.onSelectTree = treeData;

  }
  filterColumns(event: any) {
    console.log("Filter", event)
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.decisionTree.length; i++) {
      if (this.decisionTree[i].name != null) {
        if (this.decisionTree[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.decisionTree[i]);
          // console.log(typeof(this.decisionTree[i]))
        }
        // if(!this.decisionTree[i].name.toUpperCase().includes(searchText.trim().toUpperCase()))
        // {

        // }
      }
    }
  }
  clearSearchField() {
    this.searchText = '';
    this.filteredColumns = this.decisionTree
  }
  onSelectTreeClick(){
    this.onSelectTreeString = JSON.stringify(this.onSelectTree);
    this.dialogRef.close(this.onSelectTreeString);
  }

}

export class DecisionTreeData {
  constructor(
    public id: number,
    public name: string,
    public description: string
  ) { }
}
