import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { global } from '../config'
import 'rxjs/add/operator/toPromise';
@Injectable()
export class BookingService {

  constructor(private httpClient: HttpClient) { }
  pay(price:number){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    let priceStr = price.toString();
    return this.httpClient.post(global.siteUrl + 'pay',{price:priceStr},{headers: header});
  }
  withdraw(obj){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'withdraw',obj,{headers: header});
  }
  executePay(obj:any){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'execute_pay',obj,{headers: header});
  }
  addEventBooking(obj:any){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'booking/addevent',obj,{headers: header});
  }
  getBookingByUser(id:String){
  	return this.httpClient.get(global.siteUrl + 'booking/getByEventUser/' + id,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  getResourceBookingByIDs(obj){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'booking/getResourceBookingByIDs/',obj,{headers: header});
  }
  addResourceBooking(obj:any){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'booking/addresource',obj,{headers: header});
  }
  savePackage(event_package:any) {
  	localStorage.setItem('event_package' , JSON.stringify(event_package));
  }
  getResourcesByBookingID(id:String){
    return this.httpClient.get(global.siteUrl + 'booking/getResourcesByBookingID/' + id,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
  getAnalysis(obj){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'booking/getAnalysis',obj,{headers: header});
  }
  addEventbriteLink(obj){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'booking/addEventbriteLink',obj,{headers: header});
  }
  getPackage(){
    const event_package1 = localStorage.getItem('event_package');
    if(event_package1 == undefined)
      return undefined;
   
    var event_package = JSON.parse(event_package1);
    return event_package;
  }
  freePackage(){
    localStorage.removeItem('event_package');
  }
  getFeedback(obj){
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let httpParams = new HttpParams()
      .set('bookID', obj.bookID)
    .set('resourceID', obj.resourceID);
    return this.httpClient.get(global.siteUrl + 'booking/getFeedback/', {headers: httpHeaders,
    params: httpParams, 
    responseType: 'json'});
  }
  async getOverallRanking(id){
    let feedback:any = {};
    feedback.stars = 0;
    let httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let httpParams = new HttpParams()
      .set('bookID', undefined)
    .set('resourceID', id);
    const data = await this.httpClient.get(global.siteUrl + 'booking/getFeedback/', {headers: httpHeaders,
    params: httpParams, 
    responseType: 'json'}).toPromise();
      if(data['success']){
        feedback.feedbacks = data['feedback'].map((item,index) => {return item.feedback});
        feedback.feedbacks.forEach(element => {
          feedback.stars += element.stars;
        });
        if(feedback.feedbacks.length) {
          feedback.stars = Math.round(feedback.stars / feedback.feedbacks.length);
        }
      }else{
        feedback.feedbacks = [];
        feedback.stars = 0;
      }
      return feedback;
  }
  leaveFeedback(obj){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
    return this.httpClient.post(global.siteUrl + 'booking/leaveFeedback',obj,{headers: header});
  }
}
