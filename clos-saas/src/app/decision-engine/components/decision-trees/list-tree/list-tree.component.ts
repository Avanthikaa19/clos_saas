import { Component, OnInit } from '@angular/core';
import { CreateDecisionTreeComponent } from '../modals/create-decision-tree/create-decision-tree.component';
import {  DecisionTreeList } from '../../../models/DecisionTrees';
import { DecisionTreesService } from '../../../services/decision-trees.service';
import { MatDialog } from '@angular/material/dialog';
import { UrlService } from '../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { fadeInOut } from 'src/app/app.animations';

@Component({
  selector: 'app-list-tree',
  templateUrl: './list-tree.component.html',
  styleUrls: ['./list-tree.component.scss'],
  animations:[fadeInOut]
})
export class ListTreeComponent implements OnInit {
  inputText:string;
  loading: boolean = false;
  treeList: DecisionTreeList[] = [];
  filterList: DecisionTreeList[] = [];
  projectId: number = null as any;
  editTree: boolean = false;
  sortFileds:any[]=['Ascending','Descending']
  constructor(
    public dialog: MatDialog,
    private url: UrlService,
    private decisionTreeService: DecisionTreesService,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.getTreeList();
    console.log('Selected Project Id',this.selectedProject.selectedProjectId)
  }
  
    
 
 
 deleteDecisionTree(data:any){
  let confirmation=confirm("Are you Sure to delete Decision Tree");
    this.loading = true;
    if (confirmation == true) {
        this.decisionTreeService.deleteDecisionTree(data.id).subscribe(
        data =>{
        this.showNotification('success','Deleted Successfully.')
        setTimeout(() =>{
        this.getTreeList()}, 3000)
        // this.getTreeList();
        },
        err=>{
          this.showNotification('error', 'Oops! Something Went Wrong.');
        });
      }else{
        this.loading = false;
      }
  }
  createDecisionTree() {
    const dialogRef = this.dialog.open(CreateDecisionTreeComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      this.loading=true;
      console.log(`Dialog result: ${result}`);
      this.decisionTreeService.createDecisionTree(result).subscribe(
      res => {
        if(res){
       this.onClickCard(res.id);
        this.loading=false;
        this.showNotification('success','Created Successfully.')
      this.getTreeList();
       
       } },
      (err)=>{
        this.showNotification('error','Oops! Something Went Wrong.')
      }
    )
      
    }});
  }
  onClickCard(data: number) {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/decisionTreeView/' + data
    this.router.navigateByUrl(viewUrl)
  }

  getTreeList() {
    this.loading = true;
    this.decisionTreeService.getListOfTree().subscribe(
      res => {
        this.loading = false;
        this.treeList = res;  
        this.filterList = res.reverse();       
        if(this.treeList.length == 0){
          this.showNotification('default', "No Data Found.");
        }else{
          this.showNotification('default', "Trees Loaded Successfully.");
        }
      },
      err=>{
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }
 
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

editTreeOperations(tree:DecisionTreeList){
  const dialogRef = this.dialog.open(CreateDecisionTreeComponent, {
    data: tree
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
    let confirmation=confirm("This operation will reset the existing tree. Do you want to proceed?");
if(confirmation == true){
  console.log(`Dialog result: ${result}`);
  console.log("data",result)
  this.decisionTreeService.resetTree(result.id,result).subscribe(data=>{console.log(data)
  this.getTreeList();

  })
}}
   
    
  });
}
searchTree() {
  this.loading=true;
  if (this.inputText != "") {
    this.loading=false;
    this.treeList=[]
    this.treeList = this.filterList.filter(res => {
      return res.name.toLocaleLowerCase().match(this.inputText.toLocaleLowerCase().trim())
    })
  }
  else if((this.inputText == "")){
    this.treeList = this.filterList
  }

}

sortAsc(){
  this.treeList.sort(function(a,b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
})
}
sortDesc(){
  this.treeList.sort(function(a,b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}).reverse()
}

clearSearchField() {
  this.inputText = '';
  this.treeList = this.filterList
}
}



