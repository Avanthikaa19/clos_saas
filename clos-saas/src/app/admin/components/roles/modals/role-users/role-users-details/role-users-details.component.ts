import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/admin/components/users/models/User';
import { UsersService } from 'src/app/admin/components/users/services/users.service';
import { fadeInOut } from 'src/app/app.animations';

@Component({
  selector: 'app-role-users-details',
  templateUrl: './role-users-details.component.html',
  styleUrls: ['./role-users-details.component.scss'],
  animations: [fadeInOut]
})
export class RoleUsersDetailsComponent implements OnInit {

  //pagnation
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  users: User[] = [];
  usersList: User[] = [];
  isChecked: string = '';

  constructor(
    
    public userservice: UsersService,
    public dialogRef: MatDialogRef<RoleUsersDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)   
    public selectedUsers: any,
    private notifierService: NotifierService,
  ) {}

  ngOnInit(): void {
    console.log(this.selectedUsers);
    this.getUsersList();
  }

  getUsersList() {
    this.userservice.getUsersList(this.pageNum + 1, this.pageSize).subscribe(
      res => {
        this.users = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.getCheckedUsers();
       // this.showNotification('default', 'Loaded successfully.');
      },
      err => {
        console.log(err);
       //this.showNotification('error','Whoops! something went wrong.')
      }
    )
  }
  
  prevPage() {
    if ((this.pageNum + 1) <= 1) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum--;
    this.getUsersList();
  }

  nextPage() {
    if ((this.pageNum + 1) >= this.totalPages) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum++;
    this.getUsersList();
  }

 
  getCheckedUsers() {
    this.selectedUsers.forEach(selectReg => {
      this.users.forEach(reg => {
        if (selectReg.id === reg.id) {
          reg.isChecked = true;
        }
      })
    })
  }

  filterCheckedUsers() {
    this.users.forEach(user => {
      console.log(user);
      if (user.isChecked == true) {
        this.usersList.push(user)
      }
    })
    console.log(this.usersList)
  }



  onYesClick() {
    this.filterCheckedUsers()
    let userString = JSON.stringify(this.usersList);
    this.dialogRef.close(userString);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}
