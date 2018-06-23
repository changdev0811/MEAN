import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resource } from '../models/resource'
import { Order } from '../models/resource'
import { global } from '../config'
@Injectable()
export class PaidService {

  constructor(private httpClient: HttpClient) { }
  getFeedbacks(id){
    let header = new HttpHeaders();
    header.set('Content-Type','application/json');
  	return this.httpClient.get<Order[]>(global.siteUrl + 'orders/getByServiceId/' + id,{ headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }});
  }
}
