import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-case-manager-main',
  templateUrl: './loan-case-manager-main.component.html',
  styleUrls: ['./loan-case-manager-main.component.scss']
})
export class LoanCaseManagerMainComponent implements OnInit {

  selectedPanel: string = "verifier-queue";
   isClicked:boolean = false;
  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (this.router.url.endsWith("verifier-queue") || this.router.url.endsWith("verifier-queue-detail")) {
      this.selectedPanel = "verifier-queue";
    } else if (this.router.url.endsWith("underwriter-queue") || this.router.url.endsWith("underwriter-queue-detail")) {
      this.selectedPanel = "underwriter-queue";
    }
  }

  onRouterNavigate(routerlink: any) {
    this.selectedPanel = routerlink;
    console.log('Router link', routerlink);
    console.log('current url', this.router.url);
    let tempArray = this.router.url.split("/");
    let tempResult = tempArray[tempArray.length - 1];
    console.log(tempResult);
    let tempRouter = this.router.url;
    if (tempResult == "verifier-queue" || tempResult == "underwriter-queue") {
      tempRouter = tempRouter.substring(0, tempRouter.lastIndexOf("/"));
      // tempRouter.substring
    }
    // let tempVar = tempRouter + "/" + routerlink;
    // console.log('Temp', tempVar);
    // this.router.navigate([tempVar]);
  }

}
