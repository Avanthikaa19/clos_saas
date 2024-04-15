import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authenticationService: JwtAuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.logout();
  }

  public logout() {
    this.authenticationService.logout().subscribe(
      res => {
        this.authenticationService.clearSessionLoginData();
        this.router.navigate(['login']);
      },
      err => {
        this.authenticationService.clearSessionLoginData();
        this.router.navigate(['login']);
      }
    );
  }

}
