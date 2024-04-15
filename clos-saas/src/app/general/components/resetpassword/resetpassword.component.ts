import { Component, enableProdMode, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResetPasswordService } from './reset-password.service';
import { ResetPassword } from './ResetPassword';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  userName: string = '';
  newpassword: string = '';
  errorMsg: string = '';
  confirmPassword: string = '';
  passwordMessage: string = '';
  password: string = '';

  disableEdit: boolean;
  constructor(private resetdemoService: ResetPasswordService,
    public dialogRef: MatDialogRef<ResetpasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userName = data;
  }

  ngOnInit(): void {
  }

  resetpassword() {
   if(!this.reset()){
    console.log("fn wrks", this.userName)
    let filter = new ResetPassword()
    filter.username = this.userName;
    filter.password = this.newpassword;
    console.log("filter", filter)
    this.resetdemoService.resetpassword(filter).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close();
      }
    );
  }}

  reset() {
    if ((this.newpassword === this.confirmPassword) && this.newpassword.length != 0 ) {
      return false;
    }
    else {
      return true;
    }

  }
  getPasswordValidation() {
    this.resetdemoService.getPasswordValidation(this.newpassword).subscribe(
      res => {
      },
      (err) => {
        console.log(err.error.text)
        this.passwordMessage = err.error.text;

      }
    )
  }
}



