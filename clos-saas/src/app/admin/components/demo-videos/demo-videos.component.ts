import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaasService } from 'src/app/saas/saas-service';

@Component({
  selector: 'app-demo-videos',
  templateUrl: './demo-videos.component.html',
  styleUrls: ['./demo-videos.component.scss']
})
export class DemoVideosComponent implements OnInit {
  component_height:any;
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor(
    public router:Router,
    public saasService:SaasService,
  ) { this.updateComponentSize() }

  ngOnInit(): void {
  }
  navigateToPage(param){
    this.router.navigate([`${param}`])
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
