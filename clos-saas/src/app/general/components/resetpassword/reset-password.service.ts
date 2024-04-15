import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ResetPassword } from './ResetPassword';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
  }

  resetpassword(resetPassword: ResetPassword) {
    return this.http.post<{ message: string }>(`${this.API_URL}/domain/users/password-reset`, resetPassword);
  }
  getPasswordValidation(password:string) {
    return this.http.post<any[]>(`${this.API_URL}/domain/users/password/validation`, password);
  }
}
