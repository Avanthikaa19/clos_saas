import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { UrlService } from '../services/url-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 username:any='';
 password:any='';

  constructor(
    private route: ActivatedRoute, private router: Router,
    public url:UrlService  ) {
   }

 async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    console.log(response)
  }

  public updateUrl(): Promise<Object> {
    console.log('hiiii')
    return this.url.getUrl().toPromise();
  }
  redirectToHome() {
    const { hostname, port } = window.location;
    const newUrl = `http://${hostname}${port ? ':' + port : ''}/`;
    window.location.href = newUrl;
}

}
