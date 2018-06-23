import { Component, OnInit, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service'
import { Router } from '@angular/router';
import { AuthService} from '../services/auth.service'
import { global } from '../config'
import { ResourceService } from '../services/resource.service'
import { ListingComponent } from '../listing/listing.component'
import { FlashMessage } from 'angular-flash-message';
import { UtilityService } from '../services/utility.service';
@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.css']
})
export class SummaryPageComponent implements OnInit, AfterViewInit {
  resources:any = [];
  eventbrite:any = {};
  level:Number;
  sharedLink:string;
  bookingID:string;
  resourceStatus:string;
  booking:any = {};
  total = 0;
  fee = 0;
  hours = 0;
  @ViewChildren('resource') resourceComponents:QueryList<ListingComponent>;
  constructor(private utilityService:UtilityService,private resourceService:ResourceService,private flashMessage:FlashMessage, private authService:AuthService,private router:Router,private bookingService:BookingService, private route:ActivatedRoute) { }
  ngAfterViewInit(){

  }
  ngOnInit() {
    this.level = 1;
    this.resources = [];
    this.eventbrite = {};
    this.resourceStatus = undefined;
    this.bookingID = this.route.snapshot.params['id'];
    this.booking = {};

    this.bookingService.getResourcesByBookingID(this.bookingID).subscribe(data =>{
      let res:any = {};
      res = data;
      if(res.success){
        this.sharedLink = global.siteUrl + "events/" + this.bookingID;
        this.eventbrite.link = res.booking.eventbritelink;
        this.booking = res.booking;
        this.getInvoice();
        let resourceIDs = res.booking.resources;  
        this.resourceService.getResourceByIds(resourceIDs).subscribe(data=>{
          if(data['success']){
            this.resources = data['resources'];
            if(this.isCompleted(res.booking)){
                this.resourceStatus = this.bookingID;
            }
          }
        })
        var user = this.authService.getUser();
        if(user == undefined || user._id != res.booking.user){
          this.level = 0;
        }
      }
      else{
     
      }
    });
  }
   getDate(i){
    let dates = JSON.parse(this.booking.dates);
    let startDate = new Date(dates.start);
    startDate.setDate(startDate.getDate() + i);
    let month = startDate.getMonth() + 1;
    return startDate.getFullYear() + "-" + month + "-" + startDate.getDate();
  }
  getTime(i){
    return this.booking.timing[i]['start'] + "~" + this.booking.timing[i]['end'];
  }
  getInvoice(){
    this.hours = 0;
    this.booking.timing.forEach(element => {
      var firsttime1 = new Date('1983-2-24');
      var firsttime2 = new Date('1983-2-24');
      firsttime1.setHours(parseInt(element.start.substr(0,2)));
      firsttime1.setMinutes(parseInt(element.start.substr(3,2)));
      firsttime2.setHours(parseInt(element.end.substr(0,2)));
      firsttime2.setMinutes(parseInt(element.end.substr(3,2)));
      this.hours += Math.round(this.utilityService.GetHours(firsttime2, firsttime1) / (1000 * 60 * 60));
  
    });
  }
  Facebook(){
    let facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(this.sharedLink) + "&t=" + encodeURI("Hey checkout my event and then the url");  
    window.open(facebookUrl, "Twitter", "height=285,width=550,resizable=1");
    this.resources.forEach(element => {
      this.resourceService.addAnalysis({id:element._id, name:"facebook"}).subscribe(data =>{});
    });
  }
  Twitter(){
    let twitterUrl = "https://twitter.com/share?url=" + encodeURI(this.sharedLink) + "&via=TWITTER_HANDLE&text=" + encodeURI("Hey checkout my event and then the url");
    window.open(twitterUrl, "Twitter", "height=285,width=550,resizable=1");
    this.resources.forEach(element => {
      this.resourceService.addAnalysis({id:element._id, name:"twitter"}).subscribe(data =>{});
    });
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
  onSubmit(){
    this.bookingService.addEventbriteLink({id:this.bookingID, link:this.eventbrite.link}).subscribe(data =>{
      let res:any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg);
      }else{
        this.flashMessage.danger(res.msg);
      }
    })
  }
}
