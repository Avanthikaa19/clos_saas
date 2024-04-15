import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { SnackbarComponent } from '../snackbar';

@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.scss']
})

export class DynamicDashboardComponent implements OnInit {
  deleteConfrim:boolean=false;
  loggingout:boolean=false;
	
  constructor(
    public jwtAuthenicationService:JwtAuthenticationService,
    public router:Router,
    public snackBar:MatSnackBar,
  ) { 
    
  }
  logout() {
		this.loggingout = true;
		this.deleteConfrim = false;
		this.jwtAuthenicationService.logout().subscribe(
			res => {
				this.loggingout = false;
				this.jwtAuthenicationService.clearSessionLoginData();
				this.router.navigate(['/login']);
				this.snackBar.openFromComponent(SnackbarComponent, {
					duration: 1000, panelClass: ['success-snackbar'],
					data: {
						message: 'You have Logged out Successfully', icon: 'exit_to_app', type: 'success'
					}
				});
			}
		);
	}
  ngOnInit(): void {
    
  }

 

}


