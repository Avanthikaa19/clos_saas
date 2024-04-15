import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AccessTemplate } from '../../../access-templates/models/AccessTemplate';
import { Role } from '../../models/Role';
import { RolesService } from '../../services/roles.service';
import { RoleAccessDetailsComponent } from './role-access-details/role-access-details.component';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit {

  roleDetail: Role;
  template: AccessTemplate[] = [];
  roleTemplate: AccessTemplate[] = [];
  message: string ='';
  rolesList:string[] = ["ADMIN","SUPER","NORMALUSER"];

  //template name vars
  changeTemplateNamesText: boolean = false;
  templateNamesShort: string = '';
  currentDate: string = ''
  templateNamesFull: string = '';

  constructor(
    private router: Router,
    public ac: AccessControlData,
    public configurationService: ConfigurationService,
    public encryptDecryptService:EncryptDecryptService,
    private roleDataService: RolesService, public datepipe: DatePipe,
    public dialog: MatDialog,
    private notifierService: NotifierService,
  ) {
    if(sessionStorage.getItem('roles_data')){
      let decryptRole= this.encryptDecryptService.decryptData(sessionStorage.getItem('roles_data'))
      this.roleDetail = JSON.parse(decryptRole);
    }
    else {
      this.roleDetail = new Role(null as any, null as any, '', '', '', [], null as any, null as any,null as any, '', '', '');
    }

  }
  @Output() templateChange = new EventEmitter<any>();

  ngOnInit() {
    //this. getTemplatesDetail();
    this.setTemplateName();

    this.createdDateConversion();
  }

  onGoBackClick() {
    this.router.navigateByUrl('admin/admin/roles');
  }

  saveRole() {
    if(!this.disable()){
    console.log(this.roleDetail)
    if (!this.roleDetail.id) {
      console.log("before")

      this.roleDataService.createRole(this.roleDetail).subscribe(
        (res) => {
          console.log(this.roleDetail,res)
          this.showNotification('default', 'Created successfully.');
          this.router.navigateByUrl('admin/admin/roles');
        },
        (err) => {
          console.log(JSON.stringify(err.error.text));
          if(typeof JSON.stringify(err.error.text) =='string'){
            this.message=JSON.stringify(err.error.text);
          }
        }
      )
    } else {
      this.roleDataService.editRole(this.roleDetail.id, this.roleDetail).subscribe(
        (res) => {
          console.log(res);
          this.showNotification('default', 'Edited successfully.');
          this.router.navigateByUrl('admin/admin/roles');
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }}

  onDeleteBtnClick() {
    if (this.roleDetail.id) {
      let confirmation = confirm("Are you sure to delete?");
      if (confirmation == true) {
        this.roleDataService.deleteRole(this.roleDetail.id).subscribe(res => {
          console.log(res);
          this.showNotification('default', 'Deleted successfully.');
          this.onGoBackClick()
        })
      }
    }
  }

  getTemplatesDetail() {
    const dialogRef = this.dialog.open(RoleAccessDetailsComponent, {
      height: '80vh',
      width: '35vw',
      data: this.roleDetail.defaultAccessTemplate
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.roleTemplate = [];
        let roleJson = JSON.parse(result);
        roleJson.forEach(template => {
          this.roleTemplate.push(template);
        });
        console.log("Emmited", this.roleTemplate);

        this.templateChange.emit(this.roleTemplate);
        this.roleDetail.defaultAccessTemplate = this.roleTemplate
        console.log("this.roleDetail.defaultAccessTemplate", this.roleDetail.defaultAccessTemplate)
        this.setTemplateName();
      }
    });
  }

  createdDateConversion() {
    console.log('createdDateConversion', this.roleDetail)
    if (!this.roleDetail.created) {
      let date = new Date();
      this.currentDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      console.log(this.currentDate)
    }
    else if (this.roleDetail.created) {
      this.currentDate = this.datepipe.transform(this.roleDetail.created, 'dd-MM-yyyy');
    }
  }

  onUserTemplateChange(templates: any) {
    console.log('Template Change', templates);
    this.roleDetail.defaultAccessTemplate = templates;
    this.templateNamesShort = '';
    this.templateNamesFull = '';
    this.setTemplateName();
  }

  setTemplateName() {
    if (this.roleDetail.defaultAccessTemplate != null && this.roleDetail.defaultAccessTemplate.length > 0) {
      if (this.roleDetail.defaultAccessTemplate.length > 1) {
        console.log("satiisfied")
        this.templateNamesShort = this.roleDetail.defaultAccessTemplate[0].name + ' ( ' + ' + ' + (this.roleDetail.defaultAccessTemplate.length - 1) + ' more..' + ')';
        for (let i = 0; i < this.roleDetail.defaultAccessTemplate.length; i++) {
          this.templateNamesFull = this.templateNamesFull + this.roleDetail.defaultAccessTemplate[i].name;
          if (i < (this.roleDetail.defaultAccessTemplate.length - 1)) {
            this.templateNamesFull = this.templateNamesFull + ',';
          }
        }
      } else {
        this.templateNamesShort = this.roleDetail.defaultAccessTemplate[0].name;
        this.templateNamesFull = this.roleDetail.defaultAccessTemplate[0].name;
      }
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  disable(){
    if((this.roleDetail.name.length == 0 || this.roleDetail.description.length == 0)){
        return true;
    }
    else{
      return false;
    }
  
  }

}
