import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../services/validate.service';
import { FlashMessage } from 'angular-flash-message';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EventUser } from '../models/EventUser';
import { UtilityService} from '../services/utility.service'
@Component({
  selector: 'app-event-user-register',
  templateUrl: './event-user-register.component.html',
  styleUrls: ['./event-user-register.component.css']
})
export class EventUserRegisterComponent implements OnInit {
  eventuser:any = {};
  confirm:String;
  countries:any = [];
  constructor(
    private validateService : ValidateService,
    private flashMessage : FlashMessage,
    private authService : AuthService,
    private router : Router,private utilityService:UtilityService) { }

  ngOnInit() {
  }
  OnGetCountries(){
    this.countries = this.utilityService.GetCountries();
  }
  onRegisterTrue(){
    window.scrollTo(0, 50);
    this.eventuser.usertype = "EventOrganiser";
    if(!this.validateService.validateRegisterEventUser(this.eventuser)){
      this.flashMessage.danger('Please fill in all fields',{delay:2000});
      return false;
    }
    if(!this.validateService.validateEmail(this.eventuser.email)){
      this.flashMessage.danger('Please fill correct email address');
      return false;
    }
    if(this.eventuser.password != this.confirm){
      this.flashMessage.danger("Password doesn't match.");
      return false;
    }
    

    this.authService.registerEventUser(this.eventuser).subscribe( data => {
      var res:any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg,{delay:2000});
        this.router.navigate(['/event/login']);
        this.eventuser = {};
      } else{
        this.flashMessage.danger(res.msg,{delay:2000});  
      }
    });
  }
}
