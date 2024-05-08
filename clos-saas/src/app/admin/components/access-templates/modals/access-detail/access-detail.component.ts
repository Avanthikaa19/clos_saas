import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { AccessTemplate } from '../../models/AccessTemplate';
import { AccessService } from '../../services/access.service';

@Component({
  selector: 'app-access-detail',
  templateUrl: './access-detail.component.html',
  styleUrls: ['./access-detail.component.scss']
})
export class AccessDetailComponent implements OnInit {

  accessDetail: AccessTemplate;
  currentDate: string = '';
  currentUser: string = '';
  showMoreInfo:boolean=false;
  constructor(
    private router: Router,
    public configurationService: ConfigurationService,
    public encryptDecryptService: EncryptDecryptService,
    public ac: AccessControlData,
    private notifierService: NotifierService,
    private accessDetailDataService: AccessService,
    public datepipe: DatePipe,
  ) {
    let user = sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser = encryptDecryptService.decryptData(user)
    console.log(this.accessDetailDataService.setAccessTemplate());
    let data = this.accessDetailDataService.setAccessTemplate();
    if (data) {
      this.accessDetail = data;
    } else {
      this.accessDetail = new AccessTemplate(null as any, '', '', null as any, this.currentUser, null as any, '', []);

    }
    if (!this.accessDetail.id) {
      this.accessDetail.creator = this.currentUser;
      console.log("access template", this.accessDetail.creator)
    }
    if (sessionStorage.getItem('access_data')) {
      let decryptAccessTemplate = this.encryptDecryptService.decryptData(sessionStorage.getItem('access_data'))
      this.accessDetail = JSON.parse(decryptAccessTemplate);
    }
  }

  async updateUrl(): Promise<any> {
    const value = await this.configurationService.loadConfigurations();
    return value;
  }

  async ngOnInit() {
    let URL = await this.updateUrl();
    console.log('URL_Data', URL.services.domain_data_service);
    ConfigurationService.API_URL = URL.services.domain_data_service;
    this.createdDateConversion()
  }
  onGoBackClick() {
    this.router.navigateByUrl('admin/admin/access-template');
  }

  saveAccessTemplate() {
    if (!this.disable()) {
      console.log('AccessTemplate Details', this.accessDetail)
      if (!this.accessDetail.id) {
        this.accessDetailDataService.createAccessTemplate(this.accessDetail).subscribe(
          (res) => {
            console.log(res);
            this.router.navigateByUrl('admin/admin/access-template');
            this.showNotification('success', 'Template created Successfully.')
          },
          (err) => {
            console.log(err);
          }
        )
      } else {
        this.accessDetail.editor = this.currentUser;
        this.accessDetailDataService.editAccessTemplate(this.accessDetail.id, this.accessDetail).subscribe(
          (res) => {
            console.log(res);
            this.router.navigateByUrl('admin/admin/access-template');
            this.showNotification('success', 'Template edited Successfully.')
          },
          (err) => {
            console.log(err);
          }
        )
      }
    }
  }
  onaccessChange(access: any) {
    console.log('access Change', access);
    this.accessDetail.accessibleItems = access;
  }
  createdDateConversion() {

    console.log('createdDateConversion', this.accessDetail)
    if (!this.accessDetail.created) {
      let date = new Date();
      this.currentDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      console.log(this.currentDate)
    }
    else if (this.accessDetail.created) {
      this.currentDate = this.datepipe.transform(this.accessDetail.created, 'dd-MM-yyyy');
    }
  }

  disable() {
    if ((this.accessDetail.name?.length == 0 || this.accessDetail.description?.length == 0)) {
      return true;
    }
    else {
      return false;
    }
  }

  onDeleteBtnClick() {
    if (this.accessDetail.id) {
      let confirmation = confirm("Are you sure to delete?");
      if (confirmation == true) {
        this.accessDetailDataService.deleteAccessTemplateRoles(this.accessDetail.id).subscribe(res => {
          console.log(res);
          this.showNotification('success', 'Template deleted Successfully.')
          this.onGoBackClick()
        })
      }
    }
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}

