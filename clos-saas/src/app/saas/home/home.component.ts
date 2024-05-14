import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaasService } from '../saas-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  component_height:any;
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor(public router:Router,
    public saasService:SaasService) { this.updateComponentSize() }
  ngOnInit(): void {
    this.getPricingList();
  }
  endtoend:boolean=false;
  openchat:boolean=false;
  page:number=1;
  pageSize:number=20;
  pricingList:any=[];
  navigateToPage(param){
    this.router.navigate([`${param}`])
  }
  getPricingList(){
    this.saasService.getPricingList(this.page,this.pageSize,'desc','subscriptionName').subscribe(
      res=>{
        console.log(res)
        this.pricingList=res['data']
      },
      err=>{
        console.log(err)
      }
    )
 }

}
