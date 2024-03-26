import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UsersComponent } from './users/users.component';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { RoleComponent } from './role/role.component';
import { TemplateComponent } from './template/template.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  { path: 'home', component: HomeComponent },
  {path:'demo',component:LiveDemoComponent},
  {path:'signup',component:SignUpComponent},
  { path: `signup/login`, component: LoginComponent },
  {path:'users',component:UsersComponent},
  {path:'main',component:AdminLandingComponent},
  {path:'admin',component:SideNavComponent},
  {path:`:subdomain.clos-dev.finsurge.tech/los-gui`,component:LoginComponent},
  {path:'role',component:RoleComponent},
  {path:'template',component:TemplateComponent},
  {path:'billings',component:SubscriptionsComponent},
  {path:'pricing',component:PricingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
