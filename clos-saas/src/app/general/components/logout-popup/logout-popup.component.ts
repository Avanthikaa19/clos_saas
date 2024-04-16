import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss']
})
export class LogoutPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogoutPopupComponent>,
    public router:Router,
  ) { }

  ngOnInit(): void {
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  logout(){
    this.dialogRef.close();
    this.router.navigate(['/signup/login'])
  }
}
