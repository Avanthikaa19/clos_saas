import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Group } from '../../../groups/models/Group';
import { Role } from '../../../roles/models/Role';
import { User } from '../../models/User';
import { DatePipe } from '@angular/common'
//import { User } from '../../models/User';
import { UsersService } from '../../services/users.service';
import { NotifierService } from 'angular-notifier';
import { ResetPasswordService } from 'src/app/general/components/resetpassword/reset-password.service';
import { ResetPassword } from 'src/app/general/components/resetpassword/ResetPassword';
import { MatDialog } from '@angular/material/dialog';
import { ResetpasswordComponent } from 'src/app/general/components/resetpassword/resetpassword.component';
import { AccessControlData } from 'src/app/app.access';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { UserRolesDetailsComponent } from '../user-roles/user-roles-details/user-roles-details.component';
import { UserGroupsDetailsComponent } from '../user-groups/user-groups-details/user-groups-details.component';
export const AUTHENTICATED_USER = 'valueCheck'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  showAllRoles:boolean = false;
  userDetail: User;
  roleHeaders: string[] = [];
  genders: string[] = ["MALE", "FEMALE", "UNSPECIFIED"];
  group: Group[] = [];
  role: Role[] = [];
  currentDate: string = ''
  DateField: any;
  localUserPassword: any = '';
  countriesList:string[] = ["Malaysia","Singapore","Hond Kong","China"];
  //group name vars
  changeGroupNamesText: boolean = false;
  groupNamesShort: string = '';
  groupNamesFull: string = '';
  emailValid: boolean = false;
  formatDate: boolean = false;
  message: string = '';
  emailerrormessage:string = '';
  currentUser:string = '';
  passwordMessage: string = '';
  passwordValid: boolean = false;
  showMoreInfo:boolean=false;

  //role name vars
  changeRoleNamesText: boolean = false;
  roleNamesShort: string = '';
  roleNamesFull: string = '';
  //date-format
  maxDate = new Date();
  //errormsg
  errorMsg: string = '';
  roleName: Role[]=[];
  groupName: Group[]=[];


  constructor(
    private router: Router,
    public configurationService: ConfigurationService, public datepipe: DatePipe,
    private userDataService: UsersService,
    private notifierService: NotifierService,
    private resetPasswordService: ResetPasswordService,
    public dialog: MatDialog,
    public encryptDecryptService:EncryptDecryptService,
    public ac: AccessControlData,

  ) {
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=encryptDecryptService.decryptData(user)
    console.log(this.userDataService.setUser());
    let data = this.userDataService.setUser();
    if (data) {
      this.userDetail = data;

    } else {
      this.userDetail = new User(null as any, null as any, '', '', '', '', '', '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
        null as any, '', this.currentUser, '', '', '', '', '', null as any, [], [],[], null, null as any, null as any, null as any);
    }
    this.role;
    console.log('Row Data', this.role)

  }

  ngOnInit() {
    this.groupNamesShort = '';
    this.groupNamesFull = '';
    this.setGroupName();
    this.roleNamesShort = '';
    this.roleNamesFull = '';
    this.setRoleName();
    this.createdDateConversion()
    if (this.userDetail.birthdate) {
      this.convertStringtoDate(this.userDetail.birthdate)
    }
  }

  onDeleteBtnClick() {
    if (this.userDetail.id) {
      let confirmation = confirm("Are you sure to delete?");
      if (confirmation == true) {
        this.userDataService.deleteUser(this.userDetail.id).subscribe(res => {
          console.log(res);
          this.showNotification('success', 'User deleted Successfully.')
          this.onGoBackClick()
        })
      }
    }
  }

  createdDateConversion() {

    console.log('createdDateConversion', this.userDetail)
    if (!this.userDetail.created) {
      let date = new Date();
      this.currentDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      console.log(this.currentDate)
    }
    else if (this.userDetail.created) {
      this.currentDate = this.datepipe.transform(this.userDetail.created, 'dd-MM-yyyy');
      // this.currentDate =this.userDetail.created
    }
  }

  lockUnlockBtnClick() {
    if (this.userDetail.isLocked == true) {
      let alert = confirm('Are you sure to unlock user?')
      if (alert == true) {
        this.userDetail.isLocked = false;
        this.saveUser()
      }
    }
    else {
      let alert = confirm('Are you sure to lock user?')
      if (alert == true) {
        this.userDetail.isLocked = true;
        this.saveUser()
      }
    }
    console.log(this.userDetail.isLocked)
  }

  onGoBackClick() {
    this.router.navigateByUrl('admin/admin/users');
  }

  moveToSelectedTab(tabName: string) {
    console.log('moveToSelectedTab', tabName);
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {

      console.log("i", (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText)
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText.replace(/\s/g, "") == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
        console.log("", (<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText)
      }
    }
  }

  saveUser() {
    if(!this.disable()){
    this.userDetail.creator = this.currentUser;
    console.log('User Details', this.userDetail.groups);
    // this.convertDateFormat(this.userDetail.birthdate)
    if (!this.userDetail.id) {
      this.userDetail.creator = this.currentUser
      this.userDataService.createUser(this.userDetail).subscribe(
        (res) => {
          console.log("password che", res);
          if (this.userDetail.localAccount) {
            this.updateLocalUserPassword();
          } else {
            this.router.navigateByUrl('admin/admin/users');
          }
          this.showNotification('success', 'User created Successfully.')
        },
        (err) => {
          console.log(err);
          if (err.status == 400) {
            this.message = err.error['User'];
            this.emailerrormessage=err.error['EmailId'];
          
          }
          this.showNotification('error', 'Whoops! Something went wrong.')
        }
      )
    } else {
      this.userDetail.editor = this.currentUser
      this.userDataService.editUser(this.userDetail.id, this.userDetail).subscribe(
        (res) => {
          console.log(res);
          this.showNotification('success', 'User edited successfully.')
          this.router.navigateByUrl('admin/admin/users');
        },
        (err) => {
          console.log(err);
          if (err.status == 400 ) {
            this.message = err.error['User'];
            this.emailerrormessage=err.error['EmailId'];
          }
          this.showNotification('error', 'Whoops! something went wrong.')
        }
      )
    }

  }}

  onUserGroupChange(groups: any) {
    console.log('Groups Change', groups);
    this.userDetail.groups = groups;
    this.groupNamesShort = '';
    this.groupNamesFull = '';
    this.setGroupName();
  }

  setGroupName() {
    if (this.userDetail.groups != null && this.userDetail.groups.length > 0) {
      if (this.userDetail.groups.length > 1) {
        this.groupNamesShort = this.userDetail.groups[0].name + ' ( ' + ' + ' + (this.userDetail.groups.length - 1) + ' more..' + ')';
        for (let i = 0; i < this.userDetail.groups.length; i++) {
          this.groupNamesFull = this.groupNamesFull + this.userDetail.groups[i].name;
          if (i < (this.userDetail.groups.length - 1)) {
            this.groupNamesFull = this.groupNamesFull + ',';
          }
        }
      } else {
        this.groupNamesShort = this.userDetail.groups[0].name;
        this.groupNamesFull = this.userDetail.groups[0].name;
      }
    }
  }
  onUserRoleChange(roles: any) {
    console.log('Roles Change', roles);
    this.userDetail.roles = roles;
    this.roleNamesShort = '';
    this.roleNamesFull = '';
    this.setRoleName();
  }

  setRoleName() {
    if (this.userDetail.roles != null && this.userDetail.roles.length > 0) {
      if (this.userDetail.roles.length > 1) {
        this.roleNamesShort = this.userDetail.roles[0].name + ' ( ' + ' + ' + (this.userDetail.roles.length - 1) + ' more..' + ')';
        for (let i = 0; i < this.userDetail.roles.length; i++) {
          this.roleNamesFull = this.roleNamesFull + this.userDetail.roles[i].name;
          if (i < (this.userDetail.roles.length - 1)) {
            this.roleNamesFull = this.roleNamesFull + ',';
          }
        }
      } else {
        this.roleNamesShort = this.userDetail.roles[0].name;
        this.roleNamesFull = this.userDetail.roles[0].name;
      }
    }
  }

  convertStringtoDate(datestring: string) {
    let parts_of_date: any = datestring.split("-");
    let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);
    console.log(output.toString());
    this.DateField = output
  }

  dateChange() {
    console.log(this.DateField);
    if (this.DateField) {
      let formatDate = this.datepipe.transform(this.DateField, 'dd-MM-yyyy');
      console.log(typeof formatDate, formatDate)
      this.userDetail.birthdate = formatDate
    }
  }

  getErrorMsg(): string {
    if (!this.userDetail.username) {
      return 'UserName is a required field';
    }
    if (!this.userDetail.firstName) {
      return 'FirstName is a required field';
    }
    return '';
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  updateLocalUserPassword() {
    console.log(this.userDetail.username, this.localUserPassword);
    let resetPwd = new ResetPassword();
    resetPwd.username = this.userDetail.username;
    resetPwd.password = this.localUserPassword;
    this.resetPasswordService.resetpassword(resetPwd).subscribe(
      (res) => {
        console.log()
        this.router.navigateByUrl('admin/admin/users');
      },
      (err) => {
        console.log(err);
      }
    )
  }

  openResetPassword() {
    const dialogRef = this.dialog.open(ResetpasswordComponent, {
      data: this.userDetail.username,
      height: '80vh',
      width: '60vw',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  disable() {
   let disableCheck:Boolean=false;
    this.emailValueValidation(this.userDetail.emailId)
    if(!this.userDetail.localAccount || this.userDetail.id ){
      if ((this.userDetail.username?.length == 0 || this.userDetail.firstName?.length == 0 || this.userDetail.lastName?.length == 0 || !this.userDetail?.initial || this.userDetail.emailId?.length == 0 || !this.DateField || this.userDetail.designation?.length == 0 || this.userDetail.country?.length == 0 ||  !this.emailValid )) {
         disableCheck=true;
      }
    }
    else if(this.userDetail.localAccount){
      if ((this.userDetail.username?.length == 0 || this.userDetail.firstName?.length == 0 || this.userDetail.lastName?.length == 0 || !this.userDetail?.initial || this.userDetail.emailId?.length == 0 || !this.DateField || this.userDetail.designation?.length == 0 || this.userDetail.country?.length == 0 || !this.emailValid || !this.localUserPassword || this.passwordMessage!=" ")) {
        disableCheck= true;
      }
    }    
   else {
      disableCheck= false;
    }
   return disableCheck
  }

  emailValueValidation(emailString: any) {
    let validator = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    this.emailValid = validator.test(emailString)

  }
  getPasswordValidation() {
    this.passwordValid = true;
    this.userDataService.getPasswordValidation(this.localUserPassword).subscribe(
      res => {
        console.log(res);
      },
      (err) => {
        console.log("error",err.error.text);
        this.passwordMessage = err.error.text;
        console.log(this.passwordMessage)
      }
    )
  }

  // convert into smallcase
  onInputChange() {
    this.userDetail.username = this.userDetail.username.toLowerCase();
  }

  @Output() roleChange = new EventEmitter<any>();

  @Input()
  get roles() {
    return this.role;
  }
  set roles(val) {
    console.log(val);
    if (val.length == 0) {
      this.role.push(new Role(null,null, '', '', '', null, null,null,null, '', '', ''));
    } else {
      this.role = val;
    }
  }
    // add role dialog
    openAddRoleDialog(): void {
      const dialogRef = this.dialog.open(UserRolesDetailsComponent, {
        width: '28vw',
        height:'65vh',
        data: this.userDetail.roles
      });
      dialogRef.afterClosed().subscribe(result => {
        let roleJson = result;
        if(roleJson){
          this.userDetail.roles = [];
        roleJson.forEach(group => {
          this.userDetail.roles.push(group);
        });
      }
      });
    }

    getUserRoles() {
      if (this.role.length != 0) {
        this.roleHeaders = Object.keys(this.role[0]);
      } else {
        this.roleHeaders = Object.keys(new Role(null,null, '', '', '', null, null,null,null, '', '', ''));
      }
    }
  
      // add group dialog
      openAddGroupDialog(): void {
        const dialogRef = this.dialog.open(UserGroupsDetailsComponent, {
          width: '28vw',
          height:'65vh',
          data:  this.userDetail.groups
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result){ 
            this.userDetail.groups = []; 
           result.forEach(role => {
            this.userDetail.groups.push(role);
          });
        }
        });
        
      }
  
}
