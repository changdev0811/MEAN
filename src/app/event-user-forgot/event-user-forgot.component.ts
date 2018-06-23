import { Component, OnInit } from '@angular/core';
import { FlashMessage } from 'angular-flash-message';
import { ForgotService } from '../services/forgot.service'; 
@Component({
  selector: 'app-event-user-forgot',
  templateUrl: './event-user-forgot.component.html',
  styleUrls: ['./event-user-forgot.component.css']
})
export class EventUserForgotComponent implements OnInit {
  email_username:String;
  constructor(private forgot_service:ForgotService,private flashMessage:FlashMessage) { }

  ngOnInit() {
  }
  OnForgotSubmit(){
    if(this.email_username == undefined){
      this.flashMessage.danger('Please fill in all fields',{delay:2000});
      return false;
    }
    this.forgot_service.sendEventUserForgotPasswordRequest(this.email_username).subscribe(data => {
      var res: any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg,{delay:2000}); 
      }else{
        this.flashMessage.danger(res.msg,{delay:2000});  
      }
    });
  }
}
