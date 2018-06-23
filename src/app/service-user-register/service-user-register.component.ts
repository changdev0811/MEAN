import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../services/validate.service';
import { FlashMessage } from 'angular-flash-message';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ServiceUser } from '../models/ServiceUser';
import { UtilityService} from '../services/utility.service'
@Component({
  selector: 'app-service-user-register',
  templateUrl: './service-user-register.component.html',
  styleUrls: ['./service-user-register.component.css']
})
export class ServiceUserRegisterComponent implements OnInit {

  serviceuser:any = {};
  countries:any = [];
  confirm:String;
  constructor(
    private validateService : ValidateService,
    private flashMessage : FlashMessage,
    private authService : AuthService,
    private router : Router,
    private utilityService:UtilityService
  ) { }

  ngOnInit() {
  }
  OnGetCountries(){
    this.countries = this.utilityService.GetCountries();
  }
  onRegisterFalse(){
    window.scrollTo(0, 50);
    this.serviceuser.usertype = "ServiceProvider";
    if(!this.validateService.validateRegisterServiceUser(this.serviceuser)){
      this.flashMessage.danger('Please fill in all fields',{delay:2000});
      return false;
    }
    if(!this.validateService.validateEmail(this.serviceuser.email)){
      this.flashMessage.danger('Please fill correct email address');
      return false;
    }
    if(this.serviceuser.password != this.confirm){
      this.flashMessage.danger("Password doesn't match.");
      return false;
    }
    
    this.authService.registerServiceUser(this.serviceuser).subscribe( data => {
      var res:any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg,{delay:2000});
        this.router.navigate(['/service/login']);
        this.serviceuser = {};
      } else{
        this.flashMessage.danger(res.msg,{delay:2000});  
      }
    });
  }
}
