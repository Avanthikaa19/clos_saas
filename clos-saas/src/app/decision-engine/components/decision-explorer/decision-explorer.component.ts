import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UrlService } from '../../services/http/url.service';
import { DecisionEngineIdService } from '../../services/decision-engine-id.service';
import { DecisonEngineService } from '../../services/decison-engine.service';
import { DecisionObjectModelComponent } from '../decision-configration/decision-object-model/decision-object-model.component';
import { AccessControlData } from 'src/app/app.access';

export interface FolderNode {
  name: string;
  icon: string;
  link: any;
  projectId?: number;
  children?: FolderNode[];
  access?:boolean;
}

const TREE_DATA: FolderNode[] = [

  { name: 'Decision Services', icon: "label_important", link: 'services',access:true },
  { name: 'Decision Flow', icon: "label_important", link: 'starred',access:true  },
  { name: 'Decision Table', icon: "label_important", link: 'starred',access:true  },
  { name: 'Decision Tree', icon: "label_important", link: 'treelist',access:true  },
  { name: 'Function', icon: "label_important", link: 'shortcuts',access:true  },
  { name: 'Ruleset', icon: "label_important", link: 'delete',access:true  },
  { name: 'Business Team Set', icon: "label_important", link: 'timer',access:true  },
  { name: 'Reason Code List', icon: "label_important", link: 'starred',access:true  },
  { name: 'Custom Entity', icon: "label_important", link: 'starred',access:true  },
  { name: 'Folder', icon: "label_important", link: 'archived' ,access:true }
]

@Component({
  selector: 'app-decision-explorer',
  templateUrl: './decision-explorer.component.html',
  styleUrls: ['./decision-explorer.component.scss']
})
export class DecisionExplorerComponent implements OnInit {
  moduleName: string = '';
  // projectId: number = null as any;

  treeControl = new NestedTreeControl<FolderNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FolderNode>();
  links: string[] = [];
  router_url: string = '';
  constructor(private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private url: UrlService,
    public ac:AccessControlData,
    private DecisonEngineService: DecisonEngineService,
    private DecisionEngineIdService: DecisionEngineIdService) {
    this.dataSource.data = TREE_DATA;

    this.router.events.subscribe((e) => {

      if (e instanceof NavigationEnd) {
        this.dataSource.data.forEach(elem => {
          e.urlAfterRedirects.includes(elem.link) ? this.router_url = elem.name : "Undefined Page"
        });
      }
    });

    this.getScreenSize();
  }
  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  detecturlchange() { }
  projectName: string = null;

  // NEW CHANGE
  showFiller = true;
  screenHeight: number = 0;
  screenWidth: number = 0;
  folderData: FolderNode[] = [

    // { name: 'Decision Services', icon: "label_important", link: 'services', projectId: this.projectId },
    { name: 'Decision Flow', icon: "label_important", link: 'decisionFlow',access:this.ac.items?.DF003A_DECISION_FLOW },
    { name: 'Query Variable', icon: "label_important", link: 'query-variable',access:this.ac.items?.QV004A_QUERY_VARIABLE },
    { name: 'Decision Table Standards', icon: "label_important", link: 'decisionTables',access:this.ac.items?.DTS001A_DECISION_TABLE_HAS_ACCESS },
    { name: 'Rules', icon: "label_important", link: 'rules',access:this.ac.items?.DR001A_DECISION_RULES},
    { name: 'Rule Set', icon: "label_important", link: 'rule-set',access:this.ac.items?.DRC002A_DECISION_RULE_SET  },
    { name: 'Variables', icon: "label_important", link: 'variables',access:this.ac.items?.VAR008A_VARIABLES  },
    { name: 'Score Card', icon: "label_important", link: 'scoreCard',access:this.ac.items?.SC005A_SCORE_CARD_HAS_ACCESS },
   
    // { name: 'Decision Table', icon: "label_important", link: 'decisionTable'},
    // { name: 'Decision Tree', icon: "label_important", link: 'decisionTree' },
    // { name: 'Reason Code List', icon: "label_important", link: 'reason-code' },
    // { name: 'Variable Library', icon: "label_important", link: 'variable-library' },
    // { name: 'Function', icon: "label_important", link: 'functions'},
  ]

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 155;
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
    // this.projectId = Number(this.route.snapshot.paramMap.get("id"));
    // this.selectedProject.selectedProjectId = this.projectId;
    // this.getProjectName()
  }

  getModuleName(name: string) {
    this.moduleName = name;
  }
  // getProjectName() {
  //   this.projectService.getprojectdetail(this.projectId).subscribe((project: any) => {
  //     console.log(project)
  //     console.log(project.name)
  //     this.projectName = project.name
  //   }
  //   )
  // }
  openObjectModelConfiguration() {
    console.log(this.router.url);
    const dialogRef = this.dialog.open(DecisionObjectModelComponent, {
      width: '100vw',
      height: '93vh',
      data: { name: 'dialog' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  goBack() {
    let viewUrl = "/desicion-engine/home" 
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }

}
