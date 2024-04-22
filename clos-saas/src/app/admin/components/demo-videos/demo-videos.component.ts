import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaasService } from 'src/app/saas/saas-service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';

@Component({
  selector: 'app-demo-videos',
  templateUrl: './demo-videos.component.html',
  styleUrls: ['./demo-videos.component.scss']
})
export class DemoVideosComponent implements OnInit {
  component_height:any;
	@HostListener('window:resize', ['$event'])
  currentUser:any='';
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor(
    public router:Router,
    public saasService:SaasService,
    public encryptDecryptService:EncryptDecryptService,
  ) { this.updateComponentSize() }

  ngOnInit(): void {
  }
  navigateToPage(param){
    this.router.navigate([`${param}`])
  }
  getCurrentUser():string{
    if(sessionStorage.getItem(AUTHENTICATED_USER)){
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=this.encryptDecryptService.decryptData(user)}
    return this.currentUser
   }
  getDemoName(demo){
    this.saasService.getWatchedDemoVideo(demo).subscribe(
      res=>{
        console.log(res)
      },
      err=>{
        console.log(err)
      }
    )
  }

}
