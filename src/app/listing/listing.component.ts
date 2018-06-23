import { Component, OnInit , EventEmitter, Input, Output} from '@angular/core';
import { Resource, Feedback } from '../models/resource'
import { FlashMessage } from 'angular-flash-message';
import { ResourceService } from '../services/resource.service'
import { AuthService} from '../services/auth.service'
import { global } from '../config';
import { PaidService } from '../services/paid.service'
import { BookingService } from '../services/booking.service'

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  @Input() inputs:Resource[];
  @Input() level:number;
  @Input() bookID:String;
  @Output() onRegenerated = new EventEmitter<Resource>();
  resource:Resource;
  orders:any = [];
  bShow = true;
  feedback = new Feedback;
  rating = 0;
  images:any = [];
  currentIndex:number;
  feedbacks:any = [];
  afterChange(e) {
  }
  constructor(private bookingService:BookingService,private paidService:PaidService,private resourceService:ResourceService,private flashMessage:FlashMessage,private authService:AuthService) {

   }
   rate(i){
    this.rating = 5 - i;
    this.feedback.stars = this.rating;
    this.bookingService.leaveFeedback({bookID:this.bookID,resourceID:this.resource._id,feedback:{stars:this.rating, feedback:this.feedback.feedback +" - " + this.authService.getUsername()}}).subscribe(data=>{
      this.feedback.stars = this.rating;
    });
  }
   OnRemove(){
    if(confirm("Are you sure to delete this service")) {
      var rem = {id:this.resource._id};
      this.resourceService.delete(rem).subscribe( data => {
        var res:any = {};
        res = data;
        if(res.success){
          this.bShow = false;
          this.flashMessage.success(res.msg,{delay:2000});
        } else{
          this.flashMessage.danger(res.msg,{delay:2000});  
        }
      });
    }
    
   }

   Regenerate(){

    this.currentIndex = this.currentIndex < this.inputs.length - 1? this.currentIndex + 1:0;
    this.resource = this.inputs[this.currentIndex];
    this.onRegenerated.emit(this.resource);
    this.images = [];
    this.resource.images.forEach(element => {
      this.images.push(global.siteUrl + "uploads/" + element);
    });
    this.updateFeedback();
   }
   async updateFeedback(){
    let FeedbackObj:any = {};
    FeedbackObj = await this.bookingService.getOverallRanking(this.resource._id);
    if(FeedbackObj != undefined){
      this.feedbacks = FeedbackObj.feedbacks;
      this.feedback.stars =  FeedbackObj.stars;
    }
    console.log("returned");
   }
    ngOnInit() {
      this.bShow = true;
      this.feedbacks = [];
      this.currentIndex = 0;
      this.resource = this.inputs[this.currentIndex];
       this.resource.images.forEach(element => {
          this.images.push(global.siteUrl + "uploads/" + element);
        });
      if(this.bookID != undefined){
        
        this.bookingService.getFeedback({bookID:this.bookID,resourceID:this.resource._id}).subscribe(data=>{
          if(data['success'] && (data['feedback'][0].feedback != undefined)){
            this.feedback = data['feedback'][0].feedback;
          }else{
            this.feedback.stars = 0;
          }
        })
      }else if(this.level == 1){
        this.feedback.stars = -1;
      }
        this.updateFeedback();
        
      //   this.bookingService.getFeedback({resourceID:this.resource._id,bookID:undefined}).subscribe(data=>{
      //     if(data['success']){
      //       this.feedbacks = data['feedback'].map((item,index) => {return item.feedback});
      //       this.feedbacks.forEach(element => {
      //         this.feedback.stars += element.stars;
      //       });
      //       if(this.feedbacks.length) {
      //         this.feedback.stars = Math.round(this.feedback.stars / this.feedbacks.length);
      //       }
      //     }else{
      //       this.feedback.stars = 0;
      //     }
      //   });
   
    }
    getArray(n){
      n = n < 0?0:n;
      return new Array(n);
    }
}

