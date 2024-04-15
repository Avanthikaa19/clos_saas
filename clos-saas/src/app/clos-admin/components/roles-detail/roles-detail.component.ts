import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleAccessDetailsComponent } from 'src/app/admin/components/roles/modals/role-detail/role-access-details/role-access-details.component';
import { RoleAccesstemplateDialogComponent } from './role-accesstemplate-dialog/role-accesstemplate-dialog.component';

@Component({
  selector: 'app-roles-detail',
  templateUrl: './roles-detail.component.html',
  styleUrls: ['./roles-detail.component.scss']
})
export class RolesDetailComponent implements OnInit {
  changeRoleNamesText: boolean = false;
  roleNamesShort: string = '';
  roleNamesFull: string = '';

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  // add access template dialog
  openAccessTemplateDialog(): void {
    const dialogRef = this.dialog.open(RoleAccesstemplateDialogComponent, {
      width: '25vw',
      height: '65vh'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
