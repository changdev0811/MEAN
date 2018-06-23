import { Component, OnInit } from '@angular/core';
import { FlashMessage } from 'angular-flash-message';
import { ForgotService } from '../services/forgot.service'; 
@Component({
  selector: 'app-service-user-forgot',
  templateUrl: './service-user-forgot.component.html',
  styleUrls: ['./service-user-forgot.component.css']
})
export class ServiceUserForgotComponent implements OnInit {
  email_username:String;
  constructor(private forgot_service:ForgotService,private flashMessage:FlashMessage) { }

  ngOnInit() {
  }
  OnForgotSubmit(){
    if(this.email_username == undefined){
      this.flashMessage.danger('Please fill in all fields',{delay:2000});
      return false;
    }
    this.forgot_service.sendServiceUserForgotPasswordRequest(this.email_username).subscribe(data => {
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
