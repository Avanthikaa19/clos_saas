import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from '../../services/duplicate-checking.service';
import { DatabaseConnectionComponent } from './database-connection/database-connection.component';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  loading: boolean = false;
  rulesList: any;
  configId: number = null;
  activeStatus: boolean;
  page: number = 1;
  pageSize: number = 100;

  constructor(
    public dialog: MatDialog, 
    private notifierService: NotifierService,
    private router: Router,
    public dupliateService: DuplicateCheckingService
  ) { }

  ngOnInit(): void {
    this.getRules();
    this.dupliateService.findDuplicates().subscribe(res =>{});
  }

  openDialog() {
    const dialogRef = this.dialog.open(DatabaseConnectionComponent, {
      width: '50%',height: '70%'
    });
  }

  // Get All DB
  getRules() {
    this.loading = true;
    this.dupliateService.getAllRules(this.page,this.pageSize).subscribe(
      res => {
        this.loading = false;
        this.rulesList = res['data'];
        this.showNotification('success','Loaded successfully.')
      },
      err => {
        this.loading = false;
        this.showNotification('error','Oops! something went wrong.')
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  onSelectClick(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-details/'
    console.log(viewUrl)
    this.router.navigate([viewUrl])
  }

  onDataSourceSelect(dataSource: any){
    this.configId = dataSource.id;
    this.editDataSource();
  }

  editDataSource(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-details/'
    console.log(viewUrl)
    this.router.navigate([viewUrl],  { queryParams: { config_id: this.configId } })
  }

  // Active Status
  getActiveStatus(id,event) {
    this.dupliateService.ActivaRule = true;
    this.dupliateService.getActiveStatus(id).subscribe(
      res => {
        if(event.checked == true){
          this.showNotification('success',res);
          this.getRules();
          setTimeout(() => {
            this.router.navigateByUrl('/duplicate-checking/duplicate-checking/dashboard')
          }, 1);
          setTimeout(() => {
            this.router.navigateByUrl('/duplicate-checking/duplicate-checking/config')
          }, 2);
        }else{
          this.showNotification('success','Updated as an Disactive Rule');
        }
      },
      err => {
        this.showNotification('error',err);
      }
    )
  }

  // Delete rules
  deleteRules(id) {
    this.dupliateService.deleteRules(id).subscribe(
      res => {
        this.showNotification('success','Deleted Successfully');
        this.getRules();
      },
      err => {
        this.showNotification('error','Oops! something went wrong.');
      }
    )
  }
}
