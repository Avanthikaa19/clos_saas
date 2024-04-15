import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { Role } from '../../../roles/models/Role';
import { GroupRolesDetailsComponent } from './group-roles-details/group-roles-details.component';

@Component({
  selector: 'app-group-roles',
  templateUrl: './group-roles.component.html',
  styleUrls: ['./group-roles.component.scss']
})
export class GroupRolesComponent implements OnInit {
  groupRoles: Role[] = [];
  roleHeaders: string[] = [];

  columnDefs: ColDef[] = [];

  defaultColDef: ColDef = {
    sortable: true,
    floatingFilter: true,
    filter: true, resizable: true,
    editable: true,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private notifierService: NotifierService,
  ) {
    this.groupRoles;
    console.log('Row Data', this.groupRoles)
  }
  @Output() roleChange = new EventEmitter<any>();

  @Input()

  get roles() {
    return this.groupRoles;
  }

  set roles(val) {
    console.log(val);
    if (val == []) {
      this.groupRoles.push(new Role(null, null, '', '', '', null, null, null,null, '', '', ''));
    } else {
      this.groupRoles = val;
      console.log('groupRoles', this.groupRoles);
    }
  }
  

  getRolesDetail() {
    const dialogRef = this.dialog.open(GroupRolesDetailsComponent, {
      height: '80vh',
      width: '35vw',
      data: this.groupRoles
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.groupRoles = [];
        let roleJson = JSON.parse(result);
        roleJson.forEach(role => {
          this.groupRoles.push(role);
        });
        console.log("Emmited", this.groupRoles);
        this.roleChange.emit(this.groupRoles);
      }

    });
  }

  ngOnInit(): void {
    this.getGroupRoles();
  }
  getGroupRoles() {
    console.log('User Roles onInit', this.groupRoles.length);
    if (this.groupRoles.length != 0) {
      console.log('User Roles not empty')
      this.roleHeaders = Object.keys(this.groupRoles[0]);
    } else {
      this.roleHeaders = Object.keys(new Role(null, null, '', '', '', null, null, null,null, '', '', ''));
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}
