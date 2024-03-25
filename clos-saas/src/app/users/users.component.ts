import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userHeaders:any=['USER NAME','USER ID','EMAIL','POSITION','COMPANY NAME','COUNTRY','PHONE','STATUS']

  constructor(public router:Router) { }

  ngOnInit(): void {
  }
  backtohome(){
    const newUrl = `http://${window.location.pathname}${window.location.search}/home`;
    window.location.href=newUrl;
    this.router.navigateByUrl(newUrl)
  }

}
