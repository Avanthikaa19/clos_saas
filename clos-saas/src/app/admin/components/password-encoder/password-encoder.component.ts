import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { UsersService } from '../users/services/users.service';

@Component({
  selector: 'app-password-encoder',
  templateUrl: './password-encoder.component.html',
  styleUrls: ['./password-encoder.component.scss']
})
export class PasswordEncoderComponent implements OnInit {
  password: string = '';
  encryptedPassword: string = '';
  constructor(
    private userDataService: UsersService,
    private router: Router,
    public configurationService: ConfigurationService,
    private authenticationService: JwtAuthenticationService,
    private notifierService: NotifierService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  getPasswordEncoder() {
    this.userDataService.getPasswordEncoder(this.password).subscribe(
      res => {
        console.log(res);
      },
      (err) => {
        console.log(err.error.text)
        this.encryptedPassword = err.error.text;
      }
    )
  }
  copyTokenToClipboard() {
    let token = this.encryptedPassword;
    if (token) {
      var copyElement = document.createElement("textarea");
      copyElement.style.position = 'fixed';
      copyElement.style.opacity = '0';
      copyElement.textContent = token;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(copyElement);
      copyElement.select();
      document.execCommand('copy');
      body.removeChild(copyElement);
      this.openSnackBar('Password copied to clipboard.', '');
      return;
    }
    this.openSnackBar('No password to copy.', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
