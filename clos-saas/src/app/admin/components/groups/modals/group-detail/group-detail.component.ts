import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AccessTemplate } from '../../../access-templates/models/AccessTemplate';
import { Role } from '../../../roles/models/Role';
import { User } from '../../../users/models/User';
import { Group } from '../../models/Group';
import { GroupsService } from '../../services/groups.service';
import { RoleTemplateListComponent } from '../group-role-template/role-template-list/role-template-list.component';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {

  groupDetail: Group;
  role: Role[] = [];
  roleTemplate: AccessTemplate[] = [];
  countriesList:string[] = []
  groupRoles: Role[] = [];
  message: string = '';
  //role name vars
  changeRoleNamesText: boolean = false;
  roleNamesShort: string = '';
  roleNamesFull: string = '';

  constructor(
    private router: Router,
    public configurationService: ConfigurationService,
    private groupDataService: GroupsService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    public encryptDecryptService:EncryptDecryptService,
    public ac: AccessControlData,
  ) {
    // if (data) {
    //   this.groupDetail = data;
    //    this.groupDetail.users = []
    // } else {
    //   this.groupDetail = new Group(null as any, '','', null as any, '', null as any, [], []);
    // }
    if(sessionStorage.getItem('groups_data')){
      let decryptRole= this.encryptDecryptService.decryptData(sessionStorage.getItem('groups_data'))
      this.groupDetail = JSON.parse(decryptRole);
    }
    else{
      this.groupDetail = new Group(null as any, '','', null as any, '', null as any, [], []);
  }
  }
  @Output() templateChange = new EventEmitter<any>();

  ngOnInit() {
    console.log('Group Detail roles', this.groupDetail.roleTemplates);
    this.roleNamesShort = '';
    this.roleNamesFull = '';
    this.setRoleName();
    this.getGroupUsersList()
    this.getCountryList()
  }

  onGoBackClick() {
    this.router.navigateByUrl('admin/admin/groups');
  }

  moveToSelectedTab(tabName: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      console.log("i", (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText)
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText.replace(/\s/g, "") == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        console.log("", (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText)
      }
    }
  }

  getCountryList(){
    this.groupDataService.getCountryList().subscribe(countries=>{
      this.countriesList=countries;
    })
  }

  onDeleteBtnClick() {
    if (this.groupDetail.id) {
      let confirmation = confirm("Are you sure to delete?");
      if (confirmation == true) {
        this.groupDataService.deleteGroup(this.groupDetail.id).subscribe(res => {
          console.log(res);
          this.showNotification('default', 'Deleted successfully.');
          this.onGoBackClick()
        })
      }
    }
  }
  userChangeGroup(eventUser: User[]) {
    console.log("user chnage", eventUser)
    this.groupDetail.users = eventUser
  }
  saveGroup() {
    if(!this.disable()){
    console.log('Group Details', this.groupDetail)
    if (!this.groupDetail.id) {
      this.groupDataService.createGroup(this.groupDetail).subscribe(
        (res) => {
          console.log(res);
          this.router.navigateByUrl('admin/admin/groups');
          this.showNotification('default', 'Created successfully.');
        },
        (err) => {
          console.log(err.error);
          if (err.status == 400 && typeof err.error == 'string') {
            this.message = err.error;
          }
         this.showNotification('error', 'Whoops! something went wrong.')
        }
      )
    } else {
      this.groupDataService.editGroup(this.groupDetail).subscribe(
        (res) => {
          console.log(res);
          this.router.navigateByUrl('admin/admin/groups');
         this.showNotification('default', 'Edited successfully.')
        },
        (err) => {
          console.log(err.error);
          if (err.status == 400 && typeof err.error == 'string') {
            this.message = err.error;
          }
          this.showNotification('error', 'Whoops! something went wrong.');
        }
      )
    }
  }}

  onGroupRoleChange(roleTemplates: any) {
    console.log('Roles Change', roleTemplates);
    this.groupDetail.roleTemplates = roleTemplates;
    console.log('Group Detail', this.groupDetail);
    this.roleNamesShort = '';
    this.roleNamesFull = '';
    this.setRoleName();
  }

  setRoleName() {
    if (this.groupDetail.roleTemplates != null && this.groupDetail.roleTemplates.length > 0) {
      if (this.groupDetail.roleTemplates.length > 1) {
        this.roleNamesShort = this.groupDetail.roleTemplates[0].name + ' ( ' + ' + ' + (this.groupDetail.roleTemplates.length - 1) + ' more..' + ')';
        for (let i = 0; i < this.groupDetail.roleTemplates.length; i++) {
          this.roleNamesFull = this.roleNamesFull + this.groupDetail.roleTemplates[i].name;
          if (i < (this.groupDetail.roleTemplates.length - 1)) {
            this.roleNamesFull = this.roleNamesFull + ',';
          }
        }
      } else {
        this.roleNamesShort = this.groupDetail.roleTemplates[0].name;
        this.roleNamesFull = this.groupDetail.roleTemplates[0].name;
      }
    }
    let size = 2
    let items = this.groupDetail.roleTemplates.slice(0, size);
    console.log('Items', items);
    this.groupRoles = items;
    console.log('Group Role', items);
  }

  getTemplatesDetail() {
    const dialogRef = this.dialog.open(RoleTemplateListComponent, {
      height: '80vh',
      width: '35vw',
      data: this.groupDetail.roleTemplates
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result = JSON.parse(result)
        console.log(result)
        this.groupDetail.roleTemplates = result
        this.setRoleName()
      }
    })
  }
  getGroupUsersList() {
    if (this.groupDetail.id) {
      this.groupDataService.getUsersList(this.groupDetail.name).subscribe(result => {
        console.log("userslist", result)
        this.groupDetail.users = result;
      })
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  disable() {
    if ((!this.groupDetail.name || !this.groupDetail.description )) {
      return true;
    }
    else {
      return false;
    }

  }

}
