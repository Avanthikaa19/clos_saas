import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.scss']
})
export class AddGroupDialogComponent implements OnInit {
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  isChecked: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddGroupDialogComponent>,
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
