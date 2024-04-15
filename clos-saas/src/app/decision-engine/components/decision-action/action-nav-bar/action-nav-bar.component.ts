import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';

export interface FolderNode {
  name: string;
  icon: string;
  link: any;
  projectId?: number;
  children?: FolderNode[]
}

const FIELD_DATA: FolderNode[] = [

  { name: 'Field Editor', icon: "label_important", link: 'fieldEditor' },
]

@Component({
  selector: 'app-action-nav-bar',
  templateUrl: './action-nav-bar.component.html',
  styleUrls: ['./action-nav-bar.component.scss']
})
export class ActionNavBarComponent implements OnInit {

  moduleName: string = '';
  treeControl = new NestedTreeControl<FolderNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FolderNode>();
  links: string[] = [];
  router_url: string = '';

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  projectName: string = null;

  // NEW CHANGE
  showFiller = true;
  screenHeight: number = 0;
  screenWidth: number = 0;
  folderData: FolderNode[] = [

    { name: 'Field Editor', icon: "label_important", link: 'fieldEditor' },
  ]

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenHeight = window.innerHeight - 155;
    this.screenWidth = window.innerWidth;
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
  ) {
    this.dataSource.data = FIELD_DATA;
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.dataSource.data.forEach(elem => {
          e.urlAfterRedirects.includes(elem.link) ? this.router_url = elem.name : "Undefined Page"
        });
      }
    });
    this.getScreenSize();
  }

  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
  }

  //To show  modulename in navbar
  getModuleName(name: string) {
    this.moduleName = name;
  }

  //To go back to decision home 
  goBack() {
    let viewUrl = "/desicion-engine/home"
    this.router.navigateByUrl(viewUrl)
  }

}
