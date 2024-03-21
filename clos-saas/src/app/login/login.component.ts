import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 username:any='';
 password:any='';

  constructor(
    public router:Router,
  ) {
    this.handleUrl();
   }
   handleUrl(): void {
    // Get the current URL
    const currentUrl = window.location.href;

    // Extract the subdomain part (if present)
    const subdomain = this.extractSubdomain(currentUrl);

    if (subdomain) {
      // Construct the new URL with the subdomain
      const newUrl = `http://${subdomain}`;
      console.log(newUrl,'new-url')
      // Navigate to the new URL
      this.router.navigateByUrl(newUrl);
    }
  }

  extractSubdomain(url: string): string | null {
    // Extract the part after the protocol and before the first "/"
    const parts = url.split('://');
    if (parts.length >= 2) {
      const domainPart = parts[1].split('/')[0];

      // Split the domain part by ".localhost:41103" and take the first part
      const subdomain = domainPart.split('.localhost:41103')[0];
      console.log(subdomain)

      return subdomain;
    }
    return null;
  }
  ngOnInit(): void {
  }

}
