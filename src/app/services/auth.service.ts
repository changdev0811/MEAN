import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService  } from '@auth0/angular-jwt';
import { global } from '../config'
import { EventUser} from '../models/EventUser'
import { ServiceUser } from '../models/ServiceUser';
@Injectable()
export class AuthService {
	authToken : any;
  authuser : any;
  redirectUrl: string;
  constructor(private httpClient: HttpClient,private jwtHelperService: JwtHelperService) { }

  registerEventUser(user) {
  	let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'users/register_eventuser',user,{headers: header});
  }
  registerServiceUser(user){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'users/register_serviceuser',user,{headers: header});
  }
  editEventUser(eventUser:EventUser){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'users/editeventuser',eventUser,{headers: header});
  }
  editServiceUser(serviceUser:ServiceUser){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'users/editserviceuser',serviceUser,{headers: header});
  }
  getUser(){
    this.loadUser();
    
    if(this.authuser == undefined)
       return undefined;
    var user = JSON.parse(this.authuser);
    return user;
  }
  isServiceProvider(){
    this.loadUser();
    if(this.authuser == undefined)
      return false;
    var user = JSON.parse(this.authuser);

    return user.usertype == "ServiceProvider";
  }
  isEventOrganiser(){
    this.loadUser();
    if(this.authuser == undefined)
      return false;
    var user = JSON.parse(this.authuser);
    return user.usertype == "EventOrganiser";
  }
  authenticateEventUser(user) {
  	let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'users/authenticate_eventuser',user,{headers: header});
  }
  authenticateServiceUser(user) {
  	let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'users/authenticate_serviceuser',user,{headers: header});
  }
  saveToken(token , user) {
  	localStorage.setItem('id_token' , token);
  	localStorage.setItem('user' , JSON.stringify(user));
  	this.authToken = token;
  }
  getEventUserById(id){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
  	return this.httpClient.get(global.siteUrl + 'users/getEventUserById'+id,{headers: header});
 
  }
  getServiceUserById(id){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
  	return this.httpClient.get(global.siteUrl + 'users/getServiceUserById'+id,{headers: header});
 
  }
  updateUser(user){
    localStorage.removeItem('user');
    localStorage.setItem('user' , JSON.stringify(user));
  }
  loadToken(){
    const token = localStorage.getItem('id_token');
  	this.authToken = token;
  }
  getUsername(){
    let user = this.getUser();
    if(user != undefined)
      return user.username;
  }
  loadUser(){
    const user = localStorage.getItem('user');
  	this.authuser = user;
  }
  loggedIn(){
    this.loadToken();
    return (this.authToken?!this.jwtHelperService.isTokenExpired(this.authToken):false);
  }
  logout(){
    localStorage.clear();
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }
}
