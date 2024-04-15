import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../services/http/url.service';
import { DecisionEngineIdService } from '../../services/decision-engine-id.service';
import { ThemeSelectionService } from '../../services/theme-selection.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements AfterViewInit,OnInit {

  testModule: ExplorerList[] = [];

  displayedColumns: string[] = ['id', 'projectname', 'progress', 'createdby'];
  dataSource: MatTableDataSource<UserData>;
  id: number = null as any;
  
  screenHeight: number=0;
  screenWidth: number=0;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  public get themeSelection(): boolean {
    return this.themeSelectionService.themeSelection;
  }

  constructor(
    private themeSelectionService: ThemeSelectionService,
    private url: UrlService,
   private route: ActivatedRoute,
   private router:Router
  ) {
    // Create 100 users
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 85;
    this.screenWidth = window.innerWidth;
    // console.log('Screen Height:', this.screenHeight);
    // console.log('Screen Width:', this.screenWidth);
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if(UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
   this.getProjectDetails(this.id);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selectedModule(data:any){
    console.log('Selecte Module wrks',data)
  }

  getProjectDetails(id: number){
    this.testModule.push(TableModule);
    // this.testModule.push(TreeModule);
    this.testModule.push(FlowModule);
    this.testModule.push(VariableModule);
    // this.testModule.push(VariableLibModule);
  }
  goBack() {
    let viewUrl = "desicion-engine/home" 
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }
}



/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    createdby: name,
    progress: Math.round(Math.random() * 100).toString(),
    projectname: PROJECT[Math.round(Math.random() * (PROJECT.length - 1))]
  };

}
export interface UserData {
  id: string;
  projectname: string;
  createdby: string;
  progress: string;
}

/** Constants used to fill up our data base. */
const PROJECT: string[] = [
  'blueberry', 'lychee', 'kiwi', 'mango', 'peach', 'lime', 'pomegranate', 'pineapple'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];



//TO DISPLAY THE EXPLORER LIST
export class ExplorerList{
  constructor(
    public name: string,
    public description: string,
    public routerLink: string,
    public icon: string,
    public styleClass: string,
    public color: string,
    public wip: boolean
  ){}
}

export const TableModule: ExplorerList = new ExplorerList("Table","To test the tables and execute...",'/desicion-engine/test/tabletest','table-module','','',false);
// export const TreeModule: ExplorerList = new ExplorerList("Tree","To test the trees and execute...",'','tree-module','','',false);
export const FlowModule: ExplorerList = new ExplorerList("Flow","To test the flow and execute...",'/desicion-engine/test/flowtest','flow-module','','',false);
export const VariableModule: ExplorerList = new ExplorerList("Variable","To test the variables and execute...",'/desicion-engine/test/variabletest','variable-module','','',false);
// export const VariableLibModule: ExplorerList = new ExplorerList("Variable Library","To test the variable libraries and execute...",'/alert-config//home/p/variableLibtest','variablelib-module','','',false);

// export const TestModule01: ExplorerList = new ExplorerList("Test","Some long word to test",'','test-module','','',false);
// export const VerifyModule01: ExplorerList = new ExplorerList("Verify","Some long word to test",'','verify-module','','',false);
