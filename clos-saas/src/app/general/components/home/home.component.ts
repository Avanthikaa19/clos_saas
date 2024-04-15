import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessControlData } from 'src/app/app.access';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hideRepLoan:boolean = false;
  constructor(
    private router: Router,
    public ac: AccessControlData,
  ) { }

  ngOnInit(): void {
  }

  flow(){
    this.router.navigate(['flows']);
  }

  report(){
    this.router.navigate(['reports']);
  }

  loan(){
    this.router.navigate(['loan-org']);
  }

  case(){
    this.router.navigate(['loan-case-manager']);
  }

  admin(){
    this.router.navigate(['admin']);
  }

  alert(){
    this.router.navigate(['alert-config']);
  }
}
