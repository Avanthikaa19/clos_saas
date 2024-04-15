import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Role } from 'src/app/admin/components/roles/models/Role';
import { RolesService } from 'src/app/admin/components/roles/services/roles.service';
import { fadeInOut } from 'src/app/app.animations';

@Component({
  selector: 'app-group-roles-details',
  templateUrl: './group-roles-details.component.html',
  styleUrls: ['./group-roles-details.component.scss'],
  animations: [fadeInOut]
})
export class GroupRolesDetailsComponent implements OnInit {
  //pagnation
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  roles: Role[] = [];
  selectedRoles: Role[] = [];
  defaultChecked: Role[] = [];

  isChecked: string = '';


  constructor(
    public roleservice: RolesService,
    public dialogRef: MatDialogRef<GroupRolesDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role[],
    private notifierService: NotifierService,
  ) {
    console.log('Data updated', data);
    this.defaultChecked = data;
  }

  ngOnInit(): void {
    this.getRolesList();
  }
  getRolesList() {
    this.roleservice.getRolesList(this.pageNum + 1, this.pageSize).subscribe(
      res => {
        this.roles = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.resetSelectedRole();
       // this.showNotification('default','Loaded successfully.');
      },
      err => {
        console.log(err);
       //this.showNotification('error','Whoops! something went wrong.');
      }
    )
  }
  prevPage() {
    if ((this.pageNum + 1) <= 1) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum--;
    this.getRolesList();
  }

  nextPage() {
    if ((this.pageNum + 1) >= this.totalPages) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum++;
    this.getRolesList();
  }

  onCheckBoxChecked(role, index) {
    if (this.selectedRoles.includes(role)) {

    }
    else {
      if (role.isChecked) {
        this.selectedRoles.push(role);
      } else {
        var index: any = this.selectedRoles.findIndex(x => x.name === role.name);
        this.selectedRoles.splice(index, 1);
      }
    }
    console.log(this.selectedRoles);
  }

  resetSelectedRole() {
    console.log(this.defaultChecked);
    console.log(this.roles);
    for (let role of this.roles) {
      for (let defaultCheck of this.defaultChecked) {
        this.selectInRolesList(role, defaultCheck);
      }
    }
    this.selectedRoles = this.defaultChecked;
  }

  selectInRolesList(role: Role, defaultCheck: Role): boolean {
    if (role.name == defaultCheck.name) {
      role.isChecked = true;
      return true;
    } else {
      return false;
    }
  }

  onYesClick(): void {
    console.log('Selected Role', this.selectedRoles);
    let roleString = JSON.stringify(this.selectedRoles);
    this.dialogRef.close(roleString);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
