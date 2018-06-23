import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service'
import { AuthService } from '../services/auth.service'; 
import { FlashMessage } from 'angular-flash-message';


@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {

  constructor(private flashMessage:FlashMessage,private bookingService:BookingService, private authService:AuthService, private router:Router, private activatedRoute:ActivatedRoute) { }
  bookings:any = [];
 
  
  ngOnInit() {
    let user = this.authService.getUser();
    if(user == undefined || this.authService.isServiceProvider()){
      this.router.navigate(['/event/login']);
    }
    this.bookingService.getBookingByUser(user._id).subscribe(data => {
      let res:any = {};
      res = data;
      if(res.success){
        this.bookings = res.bookings;
      }
      else{
        this.flashMessage.danger(res.msg);
      }
    });
  }
  getTiming(item,i){
    let dates = JSON.parse(item.dates);
    let startDate = new Date(dates.start);
    startDate.setDate(startDate.getDate() + i);
    let month = startDate.getMonth() + 1;
    return startDate.getFullYear() + "-" + month + "-" + startDate.getDate() + "  " + item.timing[i]['start'] + "~" + item.timing[i]['end'];
  }
  getString(timing:string){
    let str = JSON.parse(timing);
    return str.start + " ~ " + str.end;
  }
  isCompleted(item){
    let dates = JSON.parse(item.dates);
    let lastDate = new Date(dates.end);
    let timeStr = item.timing[item.timing.length - 1].end;
    lastDate.setHours(timeStr.slice(0,2));
    lastDate.setMinutes(timeStr.slice(3,5));
    
    let now = new Date();
    return now.getTime() >= lastDate.getTime();
  }
  feedback(){
    
  }
  loop(n){
    return new Array(n);
  }
}
