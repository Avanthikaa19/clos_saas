import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {LogoutComponent} from "./components/logout/logout.component";
import { NoAccessComponent } from './components/no-access/no-access.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signup/login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'resetpassword', component:ResetpasswordComponent },
  { path: 'notifications', component:NotificationsComponent },
  { path: 'no-access', component:NoAccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
