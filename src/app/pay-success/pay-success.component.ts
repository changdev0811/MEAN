import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service'
import { Router } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { AuthService } from '../services/auth.service'
@Component({
  selector: 'app-pay-success',
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.css']
})
export class PaySuccessComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router,private flashMessage:FlashMessage,private route:ActivatedRoute,private bookingService:BookingService) { }
  PayerID:String;
  paymentId:String;
  bStatus:Number;
  bookingID:String;
  ngOnInit() {
    this.bStatus = 0;
    this.bookingID = "";
    var user = this.authService.getUser();
    if(user == undefined){
      this.flashMessage.danger("Please log in.");
      this.router.navigate(['/service/login']);
    }
    let user_id = user._id;
      let event_generate = this.bookingService.getPackage();
      if(event_generate == undefined){
        this.router.navigate(['/event/organise']);
      }
      this.route.queryParams.subscribe(params => {
        this.PayerID = params['PayerID'];
        this.paymentId = params['paymentId'];
        let priceStr = event_generate.price.toString();
        this.bookingService.executePay({price:priceStr,PayerID:this.PayerID,paymentId:this.paymentId}).subscribe(data => {
            let res:any = {};
            res = data;
            if(res.success){
                this.bookingService.freePackage();
                this.bStatus = 1;  
                this.bookingService.addEventBooking({id:this.PayerID, price:event_generate.price, event:event_generate.package, user: user_id,hour:event_generate.hour,resources:event_generate.resources.map((item,index) => {return item._id})}).subscribe(data =>{
                  let res:any = {}; 
                  res = data;
                  this.bookingID = res.id;
                  if(res.success){               
                      let index = 1;
                      event_generate.resources.forEach(element => {
                        let id = res.id + "_" + index.toString();
                        index ++;
                        this.bookingService.addResourceBooking({id:id,resource:element, event:event_generate.package,hour:event_generate.hour}).subscribe(data =>{
                          res = data;
                          if(!res.success){
                            this.flashMessage.success("Resource booking failed");
                          }
                        })
                      });
                  }else{
                    // this.bStatus = -1;    
                  }
                });
            }
            else{
              this.bStatus = -1;         
            }
        });

      });

      
  }

}
