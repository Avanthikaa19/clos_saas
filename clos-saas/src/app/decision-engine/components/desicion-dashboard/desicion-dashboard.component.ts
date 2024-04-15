import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UrlService } from '../../services/http/url.service';
import { ThemeSelectionService } from '../../services/theme-selection.service';

@Component({
  selector: 'app-desicion-dashboard',
  templateUrl: './desicion-dashboard.component.html',
  styleUrls: ['./desicion-dashboard.component.scss']
})
export class DesicionDashboardComponent implements OnInit {

  projectDetailsModule: ExplorerList[] = [];

  displayedColumns: string[] = ['id', 'projectname', 'progress', 'createdby'];
  dataSource: MatTableDataSource<UserData>;
  screenHeight: number = 0;
  screenWidth: number = 0;

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
    private router: Router,
  ) {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 85;
    this.screenWidth = window.innerWidth;
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
    this.getProjectDetails();
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
  selectedModule(data: any) {
    console.log('Selecte Module wrks', data)
  }

  getProjectDetails() {
    this.projectDetailsModule.push(ExplorerModule);
    this.projectDetailsModule.push(ActionModule);
    this.projectDetailsModule.push(ConfigurationModule);
    this.projectDetailsModule.push(TestModule);
    //   this.projectDetailsModule.push(CompareModule);
    //   this.projectDetailsModule.push(VerifyModule);
    //   this.projectDetailsModule.push(Dashboard);
    //   this.projectDetailsModule.push(Reports);
    //   this.projectDetailsModule.push(Case_Management);
    //   this.projectDetailsModule.push(AI_ML);
    //   this.projectDetailsModule.push(Monitoring);
    //   this.projectDetailsModule.push(VoiceBox);
    //   this.projectDetailsModule.push(StaticData);
  }

  goBack() {
    let viewUrl = "/flows"
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
export class ExplorerList {
  constructor(
    public name: string,
    public description: string,
    public routerLink: string,
    public icon: string,
    public styleClass: string,
    public color: string,
    public wip: boolean
  ) { }
}

export const ExplorerModule: ExplorerList = new ExplorerList("Decision Engine", "To explore decision tree, decision table and more...", '../explorer', 'explorer-module', '', '', false);
export const ActionModule: ExplorerList = new ExplorerList("Decision Action", "To explore decision action, decision table and more...", '../decisionAction', 'action-module', '', '', false);
export const ConfigurationModule: ExplorerList = new ExplorerList("Data Administration", "To plan, organize, describe and control data resources.", '../config/', 'config-module', '', '', false);
export const CompareModule: ExplorerList = new ExplorerList("Compare", "To compare the services and orchestrate across platform and it's version.", '', 'compare-module', '', '', false);
export const TestModule: ExplorerList = new ExplorerList("Test", "To test the decision services that were created for deployment.", '../test', 'test-module', '', '', false);
export const VerifyModule: ExplorerList = new ExplorerList("Verify", "To approve the decision services and it's metaphors by high level admin.", '', 'verify-module', '', '', false);
export const Dashboard: ExplorerList = new ExplorerList("Dashboards", "The most intuitive dashboards are available for your business needs.", '', 'dashboard', '', '', false);
export const Reports: ExplorerList = new ExplorerList("Reports", "Flexible to create, design and run the reports.", '', 'reports', '', '', false);
export const Case_Management: ExplorerList = new ExplorerList("Case Management", "Workflow process for resolving issues.", '', 'case_mng', '', '', false);
export const AI_ML: ExplorerList = new ExplorerList("Artificial Intelligence", "Advanced AI surveillance tools to monitor, track, and surveil trades", '', 'ai-ml', '', '', false);
export const Monitoring: ExplorerList = new ExplorerList("Monitoring", "Regular observation and recording of activities taking place in a project", '', 'monitoring', '', '', false);
export const VoiceBox: ExplorerList = new ExplorerList("Voice Box", "To address customer issues and resolve them timely", '', 'voice-box', '', '', false);
export const StaticData: ExplorerList = new ExplorerList("Static Data", "To process the static data ..", '../static', 'static-data', '', '', false);
