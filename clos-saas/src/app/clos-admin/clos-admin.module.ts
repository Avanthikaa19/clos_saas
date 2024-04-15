import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClosAdminRoutingModule } from './clos-admin-routing.module';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { ManageGroupComponent } from './components/manage-group/manage-group.component';
import { UserListingComponent } from './components/manage-user/user-listing/user-listing.component';
import { UserDetailComponent } from './components/manage-user/user-detail/user-detail.component';
import { MaterialModule } from '../material/material.module';
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { RolesListingComponent } from './components/roles-listing/roles-listing.component';
import { RolesDetailComponent } from './components/roles-detail/roles-detail.component';
import { GroupsListingComponent } from './components/groups-listing/groups-listing.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { AddRoleDialogComponent } from './components/manage-user/user-detail/add-role-dialog/add-role-dialog.component';
import { AddGroupDialogComponent } from './components/manage-user/user-detail/add-group-dialog/add-group-dialog.component';
import { RoleAccesstemplateDialogComponent } from './components/roles-detail/role-accesstemplate-dialog/role-accesstemplate-dialog.component';
import { TemplateListingComponent } from './components/manage-user/mange-template/template-listing/template-listing.component';
import { TemplateDetailComponent } from './components/manage-user/mange-template/template-detail/template-detail.component';
import { TemplateModulesComponent } from './components/manage-user/mange-template/template-modules/template-modules.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminMainComponent,
    ManageUserComponent,
    ManageGroupComponent,
    UserListingComponent,
    UserDetailComponent,
    AdminTableComponent,
    RolesListingComponent,
    RolesDetailComponent,
    GroupsListingComponent,
    GroupDetailsComponent,
    AddRoleDialogComponent,
    AddGroupDialogComponent,
    RoleAccesstemplateDialogComponent,
    TemplateListingComponent,
    TemplateDetailComponent,
    TemplateModulesComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ClosAdminRoutingModule,
    FormsModule
  ]
})
export class ClosAdminModule { }
