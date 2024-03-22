import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  { path: 'home', component: HomeComponent },
  {path:'demo',component:LiveDemoComponent},
  {path:'signup',component:SignUpComponent},
  { path: `signup/login`, component: LoginComponent },
  {path:'users',component:UsersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
