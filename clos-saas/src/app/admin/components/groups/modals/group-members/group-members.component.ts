import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { User } from '../../../users/models/User';
import { GroupMembersDetailsComponent } from './group-members-details/group-members-details.component';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {

  users: User[] = [];
  userHeaders: string[] = [];

  columnDefs: ColDef[] = [];

  defaultColDef: ColDef = {
    sortable: true,
    floatingFilter: true,
    filter: true, resizable: true,
    editable: true,
  };
  currentUser: string='';

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    public encryptDecryptService:EncryptDecryptService,
    private notifierService: NotifierService,
  ) {
    this.users;
    console.log('Row Data', this.users) 
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=encryptDecryptService.decryptData(user)
  }

  @Output() userChange = new EventEmitter<any>();

  @Input()

  get user() {
    return this.users;
  }

  set user(val) {
    console.log(val);
    if (val == []) {
      this.users.push( new User(null as any, null as any, '', '', '', '', '', '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
      null as any, '', this.currentUser, '', '', '', '', '', null as any, [], [],[],null, null as any, null as any, null as any))
  }
else {
      this.users = val;
      console.log('User in input', this.users);
    }
  }

  getUsersDetail() {
    const dialogRef = this.dialog.open(GroupMembersDetailsComponent, {
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
    this.getUser();
  }

  getUser() {
    console.log('User onInit', this.users.length);
    if (this.users.length != 0) {
      console.log('User not empty')
      this.userHeaders = Object.keys(this.users[0]);
    } else {
      this.userHeaders = Object.keys( new User(null as any, null as any, '', '', '', '', '', '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
      null as any, '', this.currentUser, '', '', '', '', '', null as any, [], [],[],null, null as any, null as any, null as any))
  }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
