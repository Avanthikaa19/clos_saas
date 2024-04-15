import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SaasLoginComponent } from './saas-login/saas-login.component';
import { LoginComponent } from '../general/components/login/login.component';
import { UsersComponent } from '../admin/components/users/users.component';
import { PricingComponent } from './pricing/pricing.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: `http://:subdomain.${window.location.hostname}/signup/login`,component:LoginComponent },
  {path:'',component:HomeComponent},
  { path: 'home', component: HomeComponent },
  {path:'demo',component:LiveDemoComponent},
  {path:'signup',component:SignUpComponent},
  { path: `signup/login`, component: LoginComponent },
  {path:'users',component:UsersComponent},
  {path:'saas-login',component:SaasLoginComponent},
  {path:'pricing',component:PricingComponent},
  {path:'payment',component:PaymentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaasRoutingModule { }
