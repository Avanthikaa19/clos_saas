import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessControlData } from 'src/app/app.access';
import { SaasService } from 'src/app/saas/saas-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hideRepLoan:boolean = false;
  access:any='';
  constructor(
    private router: Router,
    public ac: AccessControlData,
    public saasService:SaasService,
  ) { }

  ngOnInit(): void {
    this.getAccessBasedOnDomainName();
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
  //GET-ACCESS-BASED-ON-DOMAINNAME
  getAccessBasedOnDomainName(){
    const subdomain = window.location.hostname.split('.')[0];
    const newHostname = 'finsurge.tech'; 
    let authorityString = subdomain + '.' + newHostname;
    this.saasService.getAccessBasedOnDomainName(authorityString).subscribe(
      res=>{
        let accessData = res['data'];
       // Splitting the response string and removing the last element
       this.access = accessData?.split(',');
       console.log(this.access)
       console.log(res,'response-data')
      }
    )
  }
}
