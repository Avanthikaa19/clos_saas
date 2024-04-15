import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { HomeComponent } from './home/home.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SaasLoginComponent } from './saas-login/saas-login.component';
import { PaymentComponent } from './payment/payment.component';
import { PricingComponent } from './pricing/pricing.component';
@NgModule({
    declarations: [
        HomeComponent, LiveDemoComponent, SignUpComponent, SaasLoginComponent,PaymentComponent,PricingComponent
    ],
    imports: [
        MaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MatDialogModule
    ],
    providers: [],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class SaasModule { }