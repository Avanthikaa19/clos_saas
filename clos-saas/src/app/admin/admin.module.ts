import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminRoutingModule } from './admin-routing.module';
import { AdministratorHomeComponent } from './components/administrator-home/administrator-home.component';
import { AdministratorDashboardComponent } from './components/administrator-dashboard/administrator-dashboard.component';
import { ChangeApprovalComponent } from './components/change-approval/change-approval.component';
import { UsersComponent } from './components/users/users.component';
import { GroupsComponent } from './components/groups/groups.component';
import { RolesComponent } from './components/roles/roles.component';
import { AccessTemplatesComponent } from './components/access-templates/access-templates.component';
import { PortfoliosMappingComponent } from './components/portfolios-mapping/portfolios-mapping.component';
import { CounterPartiesMappingComponent } from './components/counter-parties-mapping/counter-parties-mapping.component';
import { AdminReportComponent } from './components/admin-report/admin-report.component';
import { MaterialModule } from '../material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailComponent } from './components/users/modals/user-detail/user-detail.component';
import { UsersTableComponent } from './components/users/users-table/users-table.component';
import { RolesTableComponent } from './components/roles/roles-table/roles-table.component';
import { ChangeApprovalTableComponent } from './components/change-approval/change-approval-table/change-approval-table.component';
import { GroupsTableComponent } from './components/groups/groups-table/groups-table.component';
import { GroupDetailComponent } from './components/groups/modals/group-detail/group-detail.component';
import { AccessTableComponent } from './components/access-templates/access-table/access-table.component';
import { AccessDetailComponent } from './components/access-templates/modals/access-detail/access-detail.component';
import { RoleDetailComponent } from './components/roles/modals/role-detail/role-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupMembersComponent } from './components/groups/modals/group-members/group-members.component';
import { GroupRolesComponent } from './components/groups/modals/group-roles/group-roles.component';
import { UserGroupsComponent } from './components/users/modals/user-groups/user-groups.component';
import { UserRolesComponent } from './components/users/modals/user-roles/user-roles.component';
import { RoleUsersComponent } from './components/roles/modals/role-users/role-users.component';
import { AccessibleModulesComponent } from './components/access-templates/modals/accessible-modules/accessible-modules.component';
import { AccessGroupsRolesComponent } from './components/access-templates/modals/access-groups-roles/access-groups-roles.component';
import { NotifierModule } from 'angular-notifier';
import { UserGroupsDetailsComponent } from './components/users/modals/user-groups/user-groups-details/user-groups-details.component';
import { UserRolesDetailsComponent } from './components/users/modals/user-roles/user-roles-details/user-roles-details.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { GroupRolesDetailsComponent } from './components/groups/modals/group-roles/group-roles-details/group-roles-details.component';
import { GroupAccessDetailsComponent } from './components/groups/modals/group-roles/group-access-details/group-access-details.component';
import { RoleAccessDetailsComponent } from './components/roles/modals/role-detail/role-access-details/role-access-details.component';
import { GroupMembersDetailsComponent } from './components/groups/modals/group-members/group-members-details/group-members-details.component';
import { RoleUsersDetailsComponent } from './components/roles/modals/role-users/role-users-details/role-users-details.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { AuditTrailTableComponent } from './components/audit-trail/audit-trail-table/audit-trail-table.component';
import { GroupRoleTemplateComponent } from './components/groups/modals/group-role-template/group-role-template.component';
import { RoleTemplateDetailComponent } from './components/groups/modals/group-role-template/role-template-detail/role-template-detail.component';
import { RoleTemplateListComponent } from './components/groups/modals/group-role-template/role-template-list/role-template-list.component';
import { AuditTrailViewComponent } from './components/audit-trail/audit-trail-table/audit-trail-view/audit-trail-view.component';
import { GeneralModule } from '../general/general.module';
import { PasswordEncoderComponent } from './components/password-encoder/password-encoder.component';
import { DuplicateFinderComponent } from './components/duplicate-finder/duplicate-finder.component';
import { AuditComponent } from './components/audit/audit.component';
import { ManageuserFilterComponent } from './components/users/users-table/manageuser-filter/manageuser-filter.component';
import { AuditTrailListingComponent } from './components/audit/audit-trail-listing/audit-trail-listing.component';
//import { ChangeDetailComponent } from './components/change-approval/modals/change-detail/change-detail.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { DemoVideosComponent } from './components/demo-videos/demo-videos.component';

@NgModule({
  declarations: [
    AdministratorHomeComponent,
    AdministratorDashboardComponent,
    ChangeApprovalComponent,
    UsersComponent,
    GroupsComponent,
    RolesComponent,
    AccessTemplatesComponent,
    PortfoliosMappingComponent,
    CounterPartiesMappingComponent,
    AdminReportComponent,
    UserDetailComponent,
    UsersTableComponent,
    RolesTableComponent,
    ChangeApprovalTableComponent,
    GroupsTableComponent,
    GroupDetailComponent,
    AccessTableComponent,
    AccessDetailComponent,
    RoleDetailComponent,
    GroupMembersComponent,
    GroupRolesComponent,
    UserGroupsComponent,
    UserRolesComponent,
    RoleUsersComponent,
    AccessibleModulesComponent,
    AccessGroupsRolesComponent,
    UserGroupsDetailsComponent,
    UserRolesDetailsComponent,
    GroupRolesDetailsComponent,
    GroupAccessDetailsComponent,
    RoleAccessDetailsComponent,
    GroupMembersDetailsComponent,
    RoleUsersDetailsComponent,
    AuditTrailComponent,
    AuditTrailTableComponent,
    GroupRoleTemplateComponent,
    RoleTemplateDetailComponent,
    RoleTemplateListComponent, 
    AuditComponent,
    AuditTrailViewComponent, PasswordEncoderComponent, DuplicateFinderComponent,
    AuditTrailViewComponent, PasswordEncoderComponent, DuplicateFinderComponent, ManageuserFilterComponent, AuditTrailListingComponent,
    PaymentComponent,PricingComponent,SubscriptionsComponent,DemoVideosComponent,
    // NoAccessComponent
    // MakerCheckerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    AgGridModule.withComponents([]),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    GeneralModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    }),
  ],
  exports: [
    ChangeApprovalComponent,
    ChangeApprovalTableComponent
  ],
  // providers: [UsersService]
})
export class AdminModule { }
