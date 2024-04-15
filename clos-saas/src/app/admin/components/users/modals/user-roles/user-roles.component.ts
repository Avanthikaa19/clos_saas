import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { Role } from '../../../roles/models/Role';
import { UserRolesDetailsComponent } from './user-roles-details/user-roles-details.component';
 
@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss','../../../../../common-styles/table-style.scss']
})
export class UserRolesComponent implements OnInit {

  userRoles: Role[] = [];
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
    this.userRoles;
    console.log('Row Data', this.userRoles)
  }

  @Output() roleChange = new EventEmitter<any>();

  //[input]
  @Input()
  get roles() {
    return this.userRoles;
  }
  set roles(val) {
    console.log(val);
    if (val.length == 0) {
      this.userRoles.push(new Role(null,null, '', '', '', null, null,null,null, '', '', ''));
    } else {
      this.userRoles = val;
      console.log('userRoles', this.userRoles);
    }
  }

  getRolesDetail() {
    const dialogRef = this.dialog.open(UserRolesDetailsComponent,{
      height: '80vh',
      width: '35vw',
      data: this.userRoles
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        console.log(result)
        // this.userRoles = [];
        // let roleJson = JSON.parse(result);
        // roleJson.forEach(role => {
        //   this.userRoles.push(role);
        // });
        // console.log("Emmited", this.userRoles);
        // for(let i=0;i<this.userRoles.length;i++){
        //   console.log('ggugugug',this.userRoles[i])
        // }
        // this.roleChange.emit(this.userRoles);
      }

    });
  }

  ngOnInit(): void {
    this. getUserRoles();
  }

  getUserRoles() {
    console.log('User Roles onInit', this.userRoles.length);
    if (this.userRoles.length != 0) {
      console.log('User Roles not empty')
      this.roleHeaders = Object.keys(this.userRoles[0]);
    } else {
      this.roleHeaders = Object.keys(new Role(null,null, '', '', '', null, null,null,null, '', '', ''));
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  formatTableValueName(value: any){
    if (typeof (value) == 'object') {
      if (Array.isArray(value)) {
        if (value.length > 1) {
          let valueString = value[0].name + '(' + '+' + (value.length - 1) + 'others' + ')';
          return valueString;
        } else {
          if (value.length != 0) {
            return value[0].name;
          }
        }
        return "-";
      } else {
        if (value) {
          return value.name;
        }
        return "-";
      }
    } else {
      return value;
    }}
}
