import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { UserListingComponent } from './components/manage-user/user-listing/user-listing.component';
import { RolesListingComponent } from './components/roles-listing/roles-listing.component';
import { UserDetailComponent } from './components/manage-user/user-detail/user-detail.component';
import { RolesDetailComponent } from './components/roles-detail/roles-detail.component';
import { GroupsListingComponent } from './components/groups-listing/groups-listing.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { TemplateListingComponent } from './components/manage-user/mange-template/template-listing/template-listing.component';
import { TemplateDetailComponent } from './components/manage-user/mange-template/template-detail/template-detail.component';


const routes: Routes = [
  {
    path: '',redirectTo: 'manage-user',pathMatch: 'full'},
  {
    path: '', component: AdminMainComponent, children: [
      { path: 'manage-user', component: UserListingComponent},
      { path: 'user-detail', component: UserDetailComponent },     
      { path: 'manage-roles', component: RolesListingComponent },
      { path: 'roles-detail', component: RolesDetailComponent },
      { path: 'group-list', component:GroupsListingComponent },
      { path: 'group-details', component:GroupDetailsComponent },
      { path: 'access-template', component: TemplateListingComponent },
      { path: 'access-detail', component: TemplateDetailComponent },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ClosAdminRoutingModule { }
