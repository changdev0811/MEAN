import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service'
import { Resource } from '../models/resource'
import { global } from '../config'
import { Event } from '../models/event'
@Injectable()
export class ResourceService {

  constructor(private httpClient: HttpClient, private authService:AuthService) { }
  addService(service) {
  	let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'services/add',service,{headers: header});
  }
  editService(service){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'services/edit',service,{headers: header});
  }
  getResourcesByEvent(event:Event){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    
  	return this.httpClient.post(global.siteUrl + 'services/getByEvent',event,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  getResourcesByUser(user){
    let header = new HttpHeaders();
    this.authService.loadToken();
  	header.set('Content-Type','application/json');
  	return this.httpClient.get(global.siteUrl + 'services/getByUser/' + user,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  getResourceById(id){
    
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.get(global.siteUrl + 'services/getById/' + id,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  addAnalysis(obj){
    console.log(obj.name);
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'services/addanalysis',obj,{headers: header});
  }
  getResourceByIds(IDs){
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let httpParams = new HttpParams()
      .set('IDs', IDs);
    return this.httpClient.get(global.siteUrl + 'services/getByIds/', {headers: httpHeaders,
    params: httpParams, 
    responseType: 'json'});
  }
  increaseregenerated(id){
    let header = new HttpHeaders();
  	header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'services/increaseregenerated',{id:id},{headers: header});
  }
  getServiceIDsByUser(user){
    return this.httpClient.get(global.siteUrl + 'services/getServiceIDsByUser/' + user,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  getResourceByName(name){
    let header = new HttpHeaders();
    this.authService.loadToken();
  	header.set('Content-Type','application/json');
  	return this.httpClient.get(global.siteUrl + 'services/getByName/' + name,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  getAnalysis(obj){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'services/getAnalysis',obj,{headers: header});
  }
  delete(rem){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
  	return this.httpClient.post(global.siteUrl + 'services/removeService',rem,{headers: header});
  }
}
