import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/admin/components/users/services/users.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';

@Component({
  selector: 'app-self-claim',
  templateUrl: './self-claim.component.html',
  styleUrls: ['./self-claim.component.scss']
})
export class SelfClaimComponent implements OnInit {

  users: any[] = [];
  filteredRange: string[] = [];
  sefAssign: selfassign = new selfassign()
  searchText: string = ''
  currentUser: string = '';
  username: string = ''
  duplicateId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private casemanagementService: LoanCaseManagerServiceService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<SelfClaimComponent>,
    public encryptDecryptService: EncryptDecryptService,
  ) {
    let user = sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser = encryptDecryptService.decryptData(user)
    this.duplicateId = data.popupId;
    this.sefAssign.finsurgeId = this.duplicateId;
    console.log("ids",this.duplicateId)

  }

  ngOnInit(): void {
    this.getUsersList();
  }

  // USER LIST
  getUsersList() {
    this.userService.getDropdownclaimList(this.searchText).subscribe(res => {
      console.log(res, 'users');
      this.users = res
      this.filteredRange = this.users;
    })
  }
  // SELF ASSIGN 
  selfAssign() {
    this.sefAssign.userName = this.currentUser;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  //  SELFASSIGN APPLY FUNCTIONS 
  selfAssignApply() {
    this.casemanagementService.selfAssign(this.sefAssign).subscribe(res => {
      this.dialogRef.close(1);
    })
  }
}

export class selfassign {
  finsurgeId: string[];
  userName: string;
}