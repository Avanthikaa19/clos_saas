import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { User } from '../../../users/models/User';
import { RoleUsersDetailsComponent } from './role-users-details/role-users-details.component';

@Component({
  selector: 'app-role-users',
  templateUrl: './role-users.component.html',
  styleUrls: ['./role-users.component.scss']
})
export class RoleUsersComponent implements OnInit {

  users: User[] = [];
  userHeaders: string[] = [];

  columnDefs: ColDef[] = [];

  defaultColDef: ColDef = {
    sortable: true,
    floatingFilter: true,
    filter: true, resizable: true,
    editable: true,
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private notifierService: NotifierService,
  ) {
    this.users;
    console.log('Row Data', this.users)
  }

  @Output() userChange = new EventEmitter<any>();

  @Input()

  get user() {
    return this.users;
  }

  set user(val) {
    console.log(val);
    if (val == []) {
      this.users.push(new User(null as any, null as any, '', '', '', '', null as any, '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
        null as any, '', '', '', '', '', '', '', null as any, [], [],[],null,null as any,null as any,null as any));
    } else {
      this.users = val;
      console.log('User', this.users);
    }
  }

  getUsersDetail() {
    const dialogRef = this.dialog.open(RoleUsersDetailsComponent, {
      height: '80vh',
      width: '35vw',
      data: this.users
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.users = [];
        let roleJson = JSON.parse(result);
        roleJson.forEach(role => {
          this.users.push(role);
        });
        console.log("Emmited", this.users);
        this.userChange.emit(this.users);
      }

    });
  }

  ngOnInit(): void {
    this. getUser();
  }

  getUser() {
    console.log('User onInit', this.users.length);
    if (this.users.length != 0) {
      console.log('User not empty')
      this.userHeaders = Object.keys(this.users[0]);
    } else {
      this.userHeaders = Object.keys(new User(null as any, null as any, '', '', '', '', null as any, '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
      null as any, '', '', '', '', '', '', '', null as any, [], [],[],null,null as any,null as any,null as any));
  }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
