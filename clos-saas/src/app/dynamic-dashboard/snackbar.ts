import { ViewEncapsulation, Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-snackbar',
    template: `<div class="snack d-flex">
                <!-- <mat-icon [style]="data.type == 'success'? 'background: white;border-radius: 14px;color: green;font-weight: 800;height: 20px;width: 20px;font-size: 20px;':'font-size:21px'">{{data.icon}}</mat-icon> -->
                <div [innerHTML]="data.message" class="mr-auto" style="font-size: 15px;font-style: oblique;"></div>
                <div [innerHTML]="data.action" (click)="snackBarRef.dismiss()" style="font-size: 15px;color:gold;float:right;cursor:pointer"></div>
              </div>`,
  })
  export class SnackbarComponent {
    constructor(
      public snackBarRef: MatSnackBarRef<SnackbarComponent>,
      @Inject(MAT_SNACK_BAR_DATA) public data: any,
    ) {}
  }