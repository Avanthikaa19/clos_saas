import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component';
import { AddRoleDialogComponent } from './add-role-dialog/add-role-dialog.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  changeRoleNamesText: boolean = false;
  roleNamesShort: string = '';
  roleNamesFull: string = '';
  genders: string[] = ["MALE", "FEMALE", "UNSPECIFIED"];

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
  }

  // add role dialog
  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(AddRoleDialogComponent, {
      width: '25vw',
      height:'65vh'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

    // add group dialog
    openAddGroupDialog(): void {
      const dialogRef = this.dialog.open(AddGroupDialogComponent, {
        width: '25vw',
        height:'65vh'
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    }
}
