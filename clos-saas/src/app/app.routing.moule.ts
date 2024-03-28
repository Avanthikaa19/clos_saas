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
import { PaymentComponent } from './payment/payment.component';
import { DemoVideosComponent } from './demo-videos/demo-videos.component';
import { SaasLoginComponent } from './saas-login/saas-login.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
  { path: `http://:subdomain.${window.location.hostname}/signup/login`,component:LoginComponent },
  {path:'',component:HomeComponent},
  { path: 'home', component: HomeComponent },
  {path:'demo',component:LiveDemoComponent},
  {path:'signup',component:SignUpComponent},
  { path: `signup/login`, component: LoginComponent },
  {path:'users',component:UsersComponent},
  {path:'main',component:AdminLandingComponent},
  {path:'admin',component:SideNavComponent},
  {path:'role',component:RoleComponent},
  {path:'template',component:TemplateComponent},
  {path:'billings',component:SubscriptionsComponent},
  {path:'pricing',component:PricingComponent},
  {path:'payment',component:PaymentComponent},
  {path:'demo-videos',component:DemoVideosComponent},
  {path:'saas-login',component:SaasLoginComponent},
  {path:'groups',component:GroupsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
