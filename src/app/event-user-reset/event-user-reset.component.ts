import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { Router } from '@angular/router';
import { ForgotService } from '../services/forgot.service'; 
@Component({
  selector: 'app-event-user-reset',
  templateUrl: './event-user-reset.component.html',
  styleUrls: ['./event-user-reset.component.css']
})
export class EventUserResetComponent implements OnInit {
  token: String;
  password: String;
  confirmpassword: String;
  private sub: any;
  constructor(
    private router:Router, private route: ActivatedRoute, private flashMessage: FlashMessage, private reset_service: ForgotService
  ) { 
    
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.token = params['token']; // 
  });
}
OnResetSubmit(){
  if(this.password != this.confirmpassword){
    this.flashMessage.danger('Password does not match');
    return false;
  }
  if(this.token == undefined){
    this.flashMessage.danger('Wrong Email');
    return false;
  }
  var reset_data = {
    password: this.password,
    token: this.token
  }
  this.reset_service.sendEventUserResetPasswordRequest(reset_data).subscribe(data => {
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
