import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { Group } from '../../../groups/models/Group';
import { UserGroupsDetailsComponent } from './user-groups-details/user-groups-details.component';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {

  userGroups: Group[] = [];
  groupHeaders: string[] = [];

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
    this.userGroups;
    console.log('Row Data', this.userGroups)
  }

  @Output() groupChange = new EventEmitter<any>();

  //[input]
  @Input()
  get groups() {
    return this.userGroups;
  }
  set groups(val) {
    console.log(val);
    if (val.length == 0) {
      this.userGroups.push(new Group(null as any, '','', null as any, '', null as any, [], []));
    } else {
      this.userGroups = val;
      console.log('UserGroups', this.userGroups);
    }
  }

  getGroupsDetail() {
    const dialogRef = this.dialog.open(UserGroupsDetailsComponent, {
      height: '80vh',
      width: '35vw',
      data: this.userGroups
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.userGroups = [];
        let groupJson = JSON.parse(result);
        groupJson.forEach(group => {
          this.userGroups.push(group);
        });
        console.log("Emmited", this.userGroups);
        this.groupChange.emit(this.userGroups);
      }

    });
  }

  ngOnInit(): void {
    this.getUserGroups();
  }

  getUserGroups() {
    console.log('User Groups onInit', this.userGroups.length);
    if (this.userGroups.length != 0) {
      console.log('User Groups not empty')
      this.groupHeaders = Object.keys(this.userGroups[0]);
    } else {
      this.groupHeaders = Object.keys(new Group(null as any, '','', null as any, '', null as any, [], []));
     // this.showNotification('default','Loaded successfully.');
    }
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
