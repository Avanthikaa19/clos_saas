import { Component, HostListener, OnInit } from '@angular/core';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { SaasService } from 'src/app/saas/saas-service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  userHeaders:any=['ISSUED DATE','INVOICE ID','DUE DATE','AMOUNT','STATUS','DOWNLOAD']
  component_height:any;
  invoice:any=[];
  invoiceCount:any;
  page:number=1;
  pageSize:any=10;
  currentUser:any='';
  @HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor(
    public saasService:SaasService,
    public url:UrlService,
    public encryptDecryptService:EncryptDecryptService
  ) { this.updateComponentSize() }
  public updateUrl() {
    console.log('hiiii')
    return this.url.getUrl().toPromise().then();
  }

  async ngOnInit(): Promise<void> {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    this.getAllSubscriptionDetails();
  }
  getCurrentUser():string{
    if(sessionStorage.getItem(AUTHENTICATED_USER)){
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=this.encryptDecryptService.decryptData(user)}
    return this.currentUser
   }

  //GET-ALL-SUBSCRIPTION-DETAILS
  getAllSubscriptionDetails(){
     this.saasService.getAllSubscriptionDetails(this.page,this.pageSize).subscribe(
       res=>{
         console.log(res)
         this.invoice=res['data']
         this.invoiceCount=res['count']
       },
       err=>{
         console.log(err)
       }
     )
  }
  //BLOB TO DOWNLOAD THE FILE
  saveFile(atchmt,id) {
    var blob = new Blob([atchmt], {
      type: "application/pdf;charset=utf-8;"
    });
    var downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', `Payments_${id}`);
    downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
    downloadLink.click(); 
  }
  //DOWNLOAD INVOICE
  downloadInvoice(id){
    this.saasService.downloadInvoice(id).subscribe(
      res=>{
        console.log(res)
        this.saveFile(res,id)
      },
      err=>{
        console.log(err)
      }
    )
  }
}