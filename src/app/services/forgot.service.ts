import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { global } from '../config';
@Injectable()
export class ForgotService {

  constructor(private httpClient : HttpClient) { }

  sendEventUserForgotPasswordRequest(email_username){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl+'users/forgot_eventuser',{data:email_username},{headers:header});
  }
  sendServiceUserForgotPasswordRequest(email_username){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl+'users/forgot_serviceuser',{data:email_username},{headers:header});
  }
  sendEventUserResetPasswordRequest(reset_data){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl+'users/reset_eventuser',{data:reset_data},{headers:header});
  }
  sendServiceUserResetPasswordRequest(reset_data){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl+'users/reset_serviceuser',{data:reset_data},{headers:header});
  }
}
