import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  countries:any=['INDIA','MALAYSIA','ENGLAND','SINGAPORE','HONG-KONG'];
  firstname:any='';
  lastname:any='';
  companyname:any='';
  date:any='';
  hr:any='';
  min:any='';
  ampm:any='';
  email:any='';
  phn:any='';
  demovideo:boolean=false;
  countryName:any='';
  companies: string[] = [''];
  position:any='';
  role:any='';
  roleList:any=['SUPER','ADMIN','NORMAL']
  file:any;
  onefileuploaded:boolean=false;
  id:any=0;
  domainName:any='';

    addNewCompany() {
        this.companies.push('');
    }
    removeCompany(index: number) {
      this.companies.splice(index, 1);
  }
  @ViewChild('fileInput')fileInput!: ElementRef;
  triggerFileInputClick() {
    this.fileInput?.nativeElement?.click();
  }
  handleFileInput(event: any, index: number) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file: File = fileList[0];
        console.log('File selected:', file);
        this.companies[index] = file.name;
    }
    if(this.companies[index]?.length>1){
      this.onefileuploaded=true;
    }
    
}
signup(){
  this.id++;
  this.transferDataService.setData(this.id);
  const newHost = `${this.domainName}.${window.location.host}`;
    const newUrl = `http://${newHost}${window.location.pathname}${window.location.search}${window.location.hash}`;
    // this.router.navigate(['/login'])
    console.log(newUrl,'new url')
    // window.location.href = newUrl;
    console.log(newUrl,window.location)
}
  done() {
    const newHost = `${this.domainName}.${window.location.host}`;
    const newUrl = `http://${newHost}${window.location.pathname}${window.location.search}/login`;
    console.log(newUrl,'new url')
    window.location.href = newUrl;
    this.domainName='';
    console.log(newUrl,window.location.href)
}

  constructor(
    public transferDataService:DataService,
    public router:Router,
  ) { }

  ngOnInit(): void {
  }

}
