import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 username:any='';
 password:any='';

  constructor(
    private route: ActivatedRoute, private router: Router  ) {
   }
  ngOnInit(): void {
    console.log(this.router.url),'url'
  }

}
