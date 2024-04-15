import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ObjectModelList } from '../../../models/ObjectModel';
import { UrlService } from '../../../services/http/url.service';
import { ObjectModelService } from '../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { ConditionAlertboxComponent } from '../../decision-flow/modals/condition-alertbox/condition-alertbox.component';

@Component({
  selector: 'app-default-model',
  templateUrl: './default-model.component.html',
  styleUrls: ['./default-model.component.scss']
})
export class DefaultModelComponent implements OnInit {

  objectmodels: ObjectModelList[] = [];
  selectedObjectModel: ObjectModelList = null as any;
  sideNavValues: string[] = [' Object Model', 'Database'];
  selectedTab: string = 'objectModel';
  showSaveBtn:boolean = false;

  constructor(
    private _objectmodels: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService,
    private url: UrlService,
    private router:Router,
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
    this.getObjectModels();
  }
  onClick(model: any) {
    this.selectedTab = model;
    if (model == 'objectModel') {
      console.log('Object model wrks');
      this.getObjectModels();
    } else if (model == 'dataBase') {
      console.log('database wrks')
      this.getDatabaseModels();
    }
  }

  getObjectModels() {
    this._objectmodels.getObjectModellist().subscribe(
      (res) => {
        this.objectmodels = res;
        console.log(this.objectmodels);
        this.selectedCard(this.objectmodels[0]);
      }
    )
  }

  getDatabaseModels() {
    this._objectmodels.getDatabaseModelList().subscribe(
      res => {
        console.log('Db list', res);
        this.objectmodels = res;  
      }
    )
  }

  selectedCard(model: ObjectModelList) {
    console.log(model);
    this.showSaveBtn = true;
    this.selectedObjectModel = model;
  }

  saveDefaultModel() {
    this._objectmodels.saveObjectModel(this.selectedObjectModel.id).subscribe(
      res => {
        console.log(res);
        this.showNotification('success', 'Default Model Saved Successfully.')
        if (this.selectedTab == 'objectModel') {
          console.log('Object model wrks');
          this.getObjectModels();
        } else if (this.selectedTab == 'dataBase') {
          console.log('database wrks')
          this.getDatabaseModels();
        }
      },
      (err) => {
        console.error('Error', err.message);
        this.showNotification('error', 'Oops! Something Went Wrong.')
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  onBackClick() {
    //development in progress
     let viewUrl = "/desicion-engine/config/config-nav"
     console.log(viewUrl)
     this.router.navigateByUrl(viewUrl)
   }
}
