import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service'
import { AuthService } from '../services/auth.service'; 
import { FlashMessage } from 'angular-flash-message';
import { ResourceService } from '../services/resource.service';
import { global } from '../config';
@Component({
  selector: 'app-my-booking-resource',
  templateUrl: './my-booking-resource.component.html',
  styleUrls: ['./my-booking-resource.component.css']
})
export class MyBookingResourceComponent implements OnInit {
  bookings:any = [];
  json_resources:any = {};
  withdraw:any = {};
  total:number;
  constructor(private resourceService:ResourceService,private flashMessage:FlashMessage,private bookingService:BookingService, private authService:AuthService, private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.withdraw = {};
    this.total = 0;
    let user = this.authService.getUser();
    if(user == undefined || this.authService.isEventOrganiser()){
      this.router.navigate(['/service/login']);
    }
    let idArray = [];
    this.json_resources = {};
    this.resourceService.getServiceIDsByUser(user._id).subscribe(data => {
      let res:any = {};
      res = data;
      if(res.success){
        idArray = res.IDs;
        this.bookingService.getResourceBookingByIDs({IDs:idArray}).subscribe(data => {
          let res:any = {};
          res = data;
          if(res.success){
            this.bookings = res.bookings;
            this.bookings.forEach(element => {
              this.resourceService.getResourceById(element.resource_id).subscribe(data => {
                if(data['success']){
                  this.json_resources[data['resource']['_id']] = data['resource'];
                }
              })
              if(this.isCompleted(element))
                this.total += element.price;
            });
          }
          else{
            this.flashMessage.danger(res.msg);
          }
        });
      }
      else{
        this.flashMessage.danger(res.msg);
      }
    });
    
  }
  isCompleted(item){
    try {
      let dates = JSON.parse(item.dates);
      let lastDate = new Date(dates.end);
      let timeStr = item.timing[item.timing.length - 1].end;
      lastDate.setHours(timeStr.slice(0,2));
      lastDate.setMinutes(timeStr.slice(3,5));
      
      let now = new Date();
      return now.getTime() >= lastDate.getTime();
    } catch (e) {
      return false;
    }
    
  }
  getString(timing:string){
    try{
      let str = JSON.parse(timing);
      return str.start + " ~ " + str.end;
    }catch (e) {
      return "";
    }
    
  }

  getUrl(str){
    return global.siteUrl + 'events/' + str;
  }

  getSharedLink(str){
    var res = str.split("_");
    return res[0];
  }
 getTiming(item,i){
    let dates = JSON.parse(item.dates);
    let startDate = new Date(dates.start);
    startDate.setDate(startDate.getDate() + i);
    let month = startDate.getMonth() + 1;
    return startDate.getFullYear() + "-" + month + "-" + startDate.getDate() + "  " + item.timing[i]['start'] + "~" + item.timing[i]['end'];
  }
  withdrawClick(price){
    this.total = price;
  }
  onSubmit(){
    this.bookingService.withdraw(this.withdraw).subscribe(data =>{
      let res:any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg);
      }else{
        this.flashMessage.danger(res.msg);
      }
    });
  }
}
