import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Group } from 'src/app/admin/components/groups/models/Group';
import { GroupsService } from 'src/app/admin/components/groups/services/groups.service';
import { fadeInOut } from 'src/app/app.animations';

@Component({
  selector: 'app-user-groups-details',
  templateUrl: './user-groups-details.component.html',
  styleUrls: ['./user-groups-details.component.scss'],
  animations: [fadeInOut]
})
export class UserGroupsDetailsComponent implements OnInit {

  //pagnation
  name: string = null;
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 10;
  entryCount: number = 0;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  groups: Group[] = [];
  groupsList: Group[] = [];
  isChecked: string = '';

  constructor(
    private groupService: GroupsService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<UserGroupsDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public selectedGroups: any,
  ) { }

  ngOnInit(): void {
    console.log(this.selectedGroups);
    this.getGroupsList();
  }

  getGroupsList() {
    this.groupService.getGroupsList(this.pageNum + 1, this.pageSize).subscribe(
      res => {
        this.groups = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.getCheckedGroups();
       // this.showNotification('default', 'Loaded successfully.')
      },
      err => {
        console.log(err);
       // this.showNotification('error', 'Whoops! something went wrong.')
      }
    )
  }

  prevPage() {
    if ((this.pageNum + 1) <= 1) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum--;
    this.getGroupsList();
  }

  nextPage() {
    if ((this.pageNum + 1) >= this.totalPages) {
      return;
    }
    // this.pageNum = this.pageNum + 1;
    this.pageNum++;
    this.getGroupsList();
  }

  getCheckedGroups() {
    this.selectedGroups.forEach(selectReg => {
      this.groups.forEach(reg => {
        if (selectReg.id === reg.id) {
          reg.isChecked = true;
        }
      })
    })
  }

  filterCheckedGroups() {
    this.groups.forEach(group => {
      console.log(group);
      if (group.isChecked == true) {
        this.groupsList.push(group)
      }
    })
    console.log(this.groupsList)
  }


  onApplyClick() {
    this.filterCheckedGroups()
    //let groupString = JSON.stringify(this.groupsList);
    this.dialogRef.close(this.groupsList);
    console.log(this.groupsList, 'dfghjkl')
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }


  getGroupsListNameSearch(){
    this.groupService.getGroupsListNameSearch(this.pageNum+1, this.pageSize, this.name).subscribe(
      res => {
        this.groups = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        this.currentPageStart = this.pageNum + 1;
        this.currentPageEnd = ((this.pageNum + 1) * this.pageSize) > this.entryCount ? this.entryCount : ((this.pageNum + 1) * this.pageSize);
        this.getCheckedGroups();
       // this.showNotification('default', 'Loaded successfully.');
      },
      err => {
        console.log(err);
       // this.showNotification('error', 'Whoops! something went wrong');
      }
    )
  }

}


