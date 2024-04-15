import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';

@Component({
  selector: 'app-config-navigation',
  templateUrl: './config-navigation.component.html',
  styleUrls: ['./config-navigation.component.scss']
})
export class ConfigNavigationComponent implements OnInit {

  projectId: number = null as any;
  cardDisplay: boolean = true;

  configNavs: ConfigNavs[] = [
    {
      id: 1,
      icon: "object_editor",
      header: "Object Model Editor",
      subHeader: "To Edit Object Model Files",
      navLink: "object-model-configuration"
    },
    {
      id: 2,
      icon: "default_selector",
      header: "Default Model Selector",
      subHeader: "To Select Default Object Model for Project",
      navLink: "default-model"
    },
    {
      id: 3,
      icon: "db_connection",
      header: "Database Connection",
      subHeader: "To Create Database Connection",
      navLink: "db-connection"
    },
    // {
    //   id: 4,
    //   icon: "Profile",
    //   header: "Profiling Variable",
    //   subHeader: "To Configure Profiling Variable ",
    //   navLink: "profile-list"
    // }
  ]

  constructor(
    private url: UrlService,
    private router: Router,
    private route: ActivatedRoute,
    private selectedProject: DecisionEngineIdService
  ) { }

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
    // this.onBackClick()
    // this.projectId = Number(this.route.snapshot.paramMap.get("id"));
    // console.log('Project Id', this.projectId)
    // this.selectedProject.selectedProjectId = this.projectId;
    console.log(this.selectedProject.selectedProjectId)
  }

  onCardClick(navLink: string) {
    this.cardDisplay = false;
    // console.log(navLink)
    // let t = this.router.url;
    // let viewUrl = t + '/' + navLink + '/';
    // console.log(viewUrl)
  }

  onBackClick() {
   //development in progress
    let viewUrl = "/desicion-engine/home"
    console.log(viewUrl)
    this.router.navigateByUrl(viewUrl)
  }
  // goBack(){
  //   let t = this.router.url;
  //   let viewUrl = "/home/p/details"
  //   console.log(viewUrl)
  //   this.route.navigateByUrl(viewUrl)
  // }

}

export class ConfigNavs {
  id: number;
  icon: string;
  header: string;
  subHeader: string;
  navLink: string;
}


