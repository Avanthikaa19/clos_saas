import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-role-accesstemplate-dialog',
  templateUrl: './role-accesstemplate-dialog.component.html',
  styleUrls: ['./role-accesstemplate-dialog.component.scss']
})
export class RoleAccesstemplateDialogComponent implements OnInit {
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  isChecked: string = '';

  constructor(
    public dialogRef: MatDialogRef<RoleAccesstemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public selectedRoles: any,
    private notifierService: NotifierService,
  ) {}

  ngOnInit(): void {
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}

