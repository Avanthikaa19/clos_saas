import { Component, Inject, OnInit } from '@angular/core';
import { Role } from 'src/app/admin/components/roles/models/Role';
import { GroupsService } from '../../../services/groups.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleAccessDetailsComponent } from 'src/app/admin/components/roles/modals/role-detail/role-access-details/role-access-details.component';
import { AccessTemplate } from 'src/app/admin/components/access-templates/models/AccessTemplate';
import { RoleTemplate } from '../../../models/Group';
import { RolesService } from 'src/app/admin/components/roles/services/roles.service';
import { GroupRolesDetailsComponent } from '../../group-roles/group-roles-details/group-roles-details.component';
import { NotifierService } from 'angular-notifier';




@Component({
  selector: 'app-role-template-detail',
  templateUrl: './role-template-detail.component.html',
  styleUrls: ['./role-template-detail.component.scss']
})
export class RoleTemplateDetailComponent implements OnInit {


  roles: string[] = [];
  rolesList: Role[] = [];
  roleTemplate: AccessTemplate[] = [];
  templateNamesShort: string = '';
  groupRoleTemplate: RoleTemplate = new RoleTemplate(null, '', '', null, null, []);
  changeTemplateNamesText: boolean = false;

  templateNamesFull: string = '';
  templateChange: any;
  roleDetail: Role;

  constructor(
    private groupDataService: GroupsService,
    public dialogRef: MatDialogRef<RoleTemplateDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccessTemplate[],
    private roleTemplateService: GroupsService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getTemplatesDetail() {
    const dialogRef = this.dialog.open(RoleAccessDetailsComponent, {
      height: '80vh',
      width: '35vw',
      data: this.groupRoleTemplate.accessTemplates
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.roleTemplate = [];
        this.groupRoleTemplate.accessTemplates = [];
        let roleJson = JSON.parse(result);
        roleJson.forEach(template => {
          this.roleTemplate.push(template);
          this.groupRoleTemplate.accessTemplates.push(template);
        });
        console.log("Emmited", this.roleTemplate);
        this.templateChange.emit(this.roleTemplate);
      }
    });
    // this.setTemplateName();
  }

  onAddRoleClick() {
    const dialogRef = this.dialog.open(GroupRolesDetailsComponent, {
      height: '80vh',
      width: '35vw',
      data: this.groupRoleTemplate.role
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.rolesList = [];
        this.groupRoleTemplate.role = [];
        let roleJson = JSON.parse(result);
        roleJson.forEach(template => {
          this.groupRoleTemplate.role.push(template);
        });
      }
    });
  }

  setTemplateName() {
    if (this.groupRoleTemplate.role != null && this.groupRoleTemplate.role.length > 0) {
      if (this.groupRoleTemplate.role.length > 1) {
        this.templateNamesShort = this.groupRoleTemplate.role[0].name + ' ( ' + ' + ' + (this.groupRoleTemplate.role.length - 1) + ' more..' + ')';
        for (let i = 0; i < this.groupRoleTemplate.role.length; i++) {
          this.templateNamesFull = this.templateNamesFull + this.groupRoleTemplate.role[i].name;
          if (i < (this.groupRoleTemplate.role.length - 1)) {
            this.templateNamesFull = this.templateNamesFull + ',';
          }
        }
      } else {
        this.templateNamesShort = this.groupRoleTemplate.role[0].name;
        this.templateNamesFull = this.groupRoleTemplate.role[0].name;
      }
    }
  }

  // createRoleTemplate() {
  //   if (this.groupRoleTemplate) {
  //     this.roleTemplateService.createRoleTemplate(this.groupRoleTemplate).subscribe(ruleTemplate => {
  //       console.log("ruleTemplate created", ruleTemplate);
  //       this.dialogRef.close(ruleTemplate)
  //     })

  //   }
  // }

  onRoleTemplateCreate() {
    if(!this.disable()){
    if (this.groupRoleTemplate) {
      this.roleTemplateService.createRoleTemplate(this.groupRoleTemplate).subscribe(
        (res) => {
          console.log(res);
          console.log("ruleTemplate created", res);
          this.dialogRef.close(res)
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }}

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  disable() {
    if ((this.groupRoleTemplate.name.length == 0 || this.groupRoleTemplate.description.length == 0)) {
      return true;
    }
    else {
      return false;
    }
  }

  removeAccessTemplate(index){
    console.log('Acccess Template', this.roleTemplate);
    this.roleTemplate.splice(1, index);
  }
}
