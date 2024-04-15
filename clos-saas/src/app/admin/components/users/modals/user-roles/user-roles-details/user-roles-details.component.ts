import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Role } from 'src/app/admin/components/roles/models/Role';
import { RolesService } from 'src/app/admin/components/roles/services/roles.service';
import { fadeInOut } from 'src/app/app.animations';

@Component({
  selector: 'app-user-roles-details',
  templateUrl: './user-roles-details.component.html',
  styleUrls: ['./user-roles-details.component.scss'],
  animations: [fadeInOut]
})
export class UserRolesDetailsComponent implements OnInit {

  //pagnation
  name: string = null;
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  roles: Role[] = [];
  rolesList:Role[] = [];
  isChecked: string = '';

  constructor(
    public roleservice: RolesService,
    public dialogRef: MatDialogRef<UserRolesDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public selectedRoles: any,
    private notifierService: NotifierService,
  ) {}

  ngOnInit(): void {
    console.log(this.selectedRoles);
    this.getRolesList();
  }

  getRolesListNameSearch(){
    this.roleservice.getRolesListNameSearch(this.pageNum+1, this.pageSize, this.name).subscribe(
      res => {
        this.roles = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.getCheckedRoles();
       // this.showNotification('default', 'Loaded successfully.');
      },
      err => {
        console.log(err);
       // this.showNotification('error', 'Whoops! something went wrong');
      }
    )
  }

  getRolesList() {
    this.roleservice.getRolesList(this.pageNum + 1, this.pageSize).subscribe(
      res => {
        this.roles = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.getCheckedRoles();
       // this.showNotification('default', 'Loaded successfully.');
      },
      err => {
        console.log(err);
       // this.showNotification('error', 'Whoops! something went wrong');
      }
    )
  }
  prevPage() {
    if ((this.pageNum + 1) <= 1) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum--;
    this.getRolesList();
  }

  nextPage() {
    if ((this.pageNum + 1) >= this.totalPages) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum++;
    this.getRolesList();
  }

  getCheckedRoles() {
    this.selectedRoles.forEach(selectReg=>{
      this.roles.forEach(reg=>{
        if(selectReg.id === reg.id){
          reg.isChecked = true;
        }
      })
    })
  }

  filterCheckedRoles(){
    this.roles.forEach(role=>{
      console.log(role);
      if(role.isChecked==true){
  this.rolesList.push(role)
      }
    })
    console.log(this.rolesList)
  }

  onApplyClick(){
    this.filterCheckedRoles()
    // let roleString =this.rolesList;
    this.dialogRef.close(this.rolesList);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}
