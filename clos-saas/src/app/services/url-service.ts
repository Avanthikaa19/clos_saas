import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiUrlMap } from '../models/api-url';
@Injectable({
  providedIn: 'root'
})
export class UrlService {
  public static API_URL: string| '';
  public apiUrlMap: ApiUrlMap | undefined;
  public  test:any;
  // private readonly apiUrlMapPath: string = '/assets/config/api_url_map.json';
  production = environment.production;
  private readonly apiUrlMapPath: string = '/assets/config/api-url-map.json';
  private readonly apiUrlMapPathGUI: string = '/los-gui/assets/config/api_url_map.json';
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async loadConfigurations(): Promise<any> {
    let tradeLensURL: string = '';
    if(this.production){
      tradeLensURL = this.apiUrlMapPathGUI;
    }
    else{
      tradeLensURL = this.apiUrlMapPath;
    }
    try {
      console.log('Trade Lens URL',tradeLensURL)
      const response = await this.http.get<ApiUrlMap>(`${tradeLensURL}`).toPromise();
      if(response === undefined) {
        return;
      }
      this.apiUrlMap = {
        gateway: response.gateway,
        services: {
          auth_service: response?.services?.auth_service?.replace('[gateway]', response?.gateway),
          admin_service: response?.services?.admin_service?.replace('[gateway]', response?.gateway),
          saas_service:response?.services?.saas_service?.replace('[gateway]', response?.gateway),
        }
      };
      console.log({ apiUrlMap: this.apiUrlMap });
      console.log({ apiUrlMap: this.apiUrlMap.gateway });

      this.test=this.apiUrlMap.gateway;
      return this.apiUrlMap;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public apiUrl() {
    return this.apiUrlMap;
  }
  getConfigurations() {
    return this.http.get('assets/config/api-url-map.json', { responseType: 'text' as 'json'});
  }

  getUrl() {
    return this.http.get('assets/config/api-url-map.json', { responseType: 'text' as 'json'});
  }
}