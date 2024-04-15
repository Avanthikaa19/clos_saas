import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessTemplatesComponent } from './components/access-templates/access-templates.component';
import { AdministratorDashboardComponent } from './components/administrator-dashboard/administrator-dashboard.component';
import { AdministratorHomeComponent } from "./components/administrator-home/administrator-home.component";
import { ChangeApprovalTableComponent } from './components/change-approval/change-approval-table/change-approval-table.component';
import { ChangeApprovalComponent } from './components/change-approval/change-approval.component';
import { GroupsTableComponent } from './components/groups/groups-table/groups-table.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupDetailComponent } from './components/groups/modals/group-detail/group-detail.component';
import { RolesTableComponent } from './components/roles/roles-table/roles-table.component';
import { RolesComponent } from './components/roles/roles.component';
import { UserDetailComponent } from './components/users/modals/user-detail/user-detail.component';
import { UsersTableComponent } from './components/users/users-table/users-table.component';
import { UsersComponent } from './components/users/users.component';
import { AccessTableComponent } from './components/access-templates/access-table/access-table.component';
import { AccessDetailComponent } from './components/access-templates/modals/access-detail/access-detail.component';
import { RoleDetailComponent } from './components/roles/modals/role-detail/role-detail.component';
import { UserGroupsDetailsComponent } from './components/users/modals/user-groups/user-groups-details/user-groups-details.component';
import { UserRolesDetailsComponent } from './components/users/modals/user-roles/user-roles-details/user-roles-details.component';
import { UserGroupsComponent } from './components/users/modals/user-groups/user-groups.component';
import { UserRolesComponent } from './components/users/modals/user-roles/user-roles.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { AuditTrailTableComponent } from './components/audit-trail/audit-trail-table/audit-trail-table.component';
import { PasswordEncoderComponent } from './components/password-encoder/password-encoder.component';
import { AuditComponent } from './components/audit/audit.component';
import { AuditTrailListingComponent } from './components/audit/audit-trail-listing/audit-trail-listing.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { DemoVideosComponent } from './components/demo-videos/demo-videos.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/users',
    pathMatch: 'full'
  },
  {
    path: 'admin', component: AdministratorHomeComponent, children: [
      { path: 'dashboard', component: AdministratorDashboardComponent },
      { path: 'password-encoder', component: PasswordEncoderComponent },
      {path:'subscribe',component:SubscriptionsComponent},
      {path:'demo',component:DemoVideosComponent},


      {
        path: 'users', component: UsersComponent, children: [
          { path: '', component: UsersTableComponent },
          { path: 'user-detail', component: UserDetailComponent },
          { path: 'user-groups', component: UserGroupsComponent},
          { path: 'user-roles', component: UserRolesComponent},
          { path: 'user-groups-detail', component: UserGroupsDetailsComponent},
          { path: 'user-roles-detail', component: UserRolesDetailsComponent}
        ]
      },
      {
        path: 'groups', component: GroupsComponent, children: [
          { path: '', component: GroupsTableComponent },
          { path: 'group-detail', component: GroupDetailComponent },
        ]
      },
      {
        path: 'roles', component: RolesComponent, children: [
          { path: '', component: RolesTableComponent },
          { path: 'role-detail', component: RoleDetailComponent },
        ]
      },
      { path: 'access-template', component: AccessTemplatesComponent,children:[

        { path: '', component: AccessTableComponent },
        { path: 'access-detail', component: AccessDetailComponent },
      ]
    },
    { path: 'auditTrailListing', component: AuditTrailListingComponent,children:[

      // { path: '', component: AccessTableComponent },
      // { path: 'access-detail', component: AccessDetailComponent },
    ]
  },
      {
        path: 'change-approval', component: ChangeApprovalComponent, children: [
          { path: '', component: ChangeApprovalTableComponent },
          //{ path: 'change-detail', component: ChangeDetailComponent },
        ]
      },
      {
        path: 'audit-trail', component: AuditTrailComponent, children: [
          { path: '', component: AuditTrailTableComponent },
        ]
      },
      {
        path: 'audit', component:AuditComponent
      }     
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
