import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import '@angular/compiler';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app.routing.moule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SignUpComponent } from './sign-up/sign-up.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UsersComponent } from './users/users.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { RoleComponent } from './role/role.component';
import { TemplateComponent } from './template/template.component';
import { UrlService } from './services/url-service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PricingComponent } from './pricing/pricing.component';
import { DemoVideosComponent } from './demo-videos/demo-videos.component';
import { PaymentComponent } from './payment/payment.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SaasLoginComponent } from './saas-login/saas-login.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GroupsComponent } from './groups/groups.component';
// export function ConfigLoader(injector: Injector): () => Promise<any> {
// return () => injector.get(UrlService).loadConfigurations();
// }


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LiveDemoComponent,
    SignUpComponent,
    UsersComponent,
    AdminLandingComponent,
    SideNavComponent,
    RoleComponent,
    TemplateComponent,
    SubscriptionsComponent,
    PricingComponent,
    DemoVideosComponent,
    PaymentComponent,
    SaasLoginComponent,
    GroupsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,MatNativeDateModule,
    MatSelectModule,ReactiveFormsModule,MatCheckboxModule,FormsModule,MatIconModule,MatTooltipModule,MatButtonToggleModule,MatSnackBarModule,
    MatPaginatorModule,HttpClientModule,
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useValue:{},multi:true},{provide:HttpClientModule,useValue:{}},{provide:HttpClient,useValue:{}}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
