import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../services/validate.service';
import { FlashMessage } from 'angular-flash-message';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EventUser } from '../models/EventUser';
import { UtilityService} from '../services/utility.service'
@Component({
  selector: 'app-event-user-profile',
  templateUrl: './event-user-profile.component.html',
  styleUrls: ['./event-user-profile.component.css']
})
export class EventUserProfileComponent implements OnInit {

  eventuser:any = {};
  countries:any = [];
  birthdate = "2013-01-08";
  constructor(private validateService : ValidateService,
    private flashMessage : FlashMessage,
    private authService : AuthService,
    private router : Router,private utilityService:UtilityService) { }
  
  ngOnInit() {
    
    this.eventuser = this.authService.getUser();
    this.countries = this.utilityService.GetCountries();
    
  } 
                 
  OnEdit(){
    if(!this.validateService.validateRegisterEventUser(this.eventuser)){
      this.flashMessage.danger('Please fill in all fields',{delay:2000});
      return false;
    }
    if(!this.validateService.validateEmail(this.eventuser.email)){
      this.flashMessage.danger('Please fill correct email address');
      return false;
    }
    let inputFields = document.getElementById("country") as HTMLInputElement;
    this.eventuser.country = inputFields.value;
    inputFields = document.getElementById("dateofbirth") as HTMLInputElement;
    this.eventuser.dateofbirth = inputFields.value;

    this.authService.editEventUser(this.eventuser).subscribe( data => {
      var res:any = {};
      res = data;
      if(res.success){
        this.authService.getEventUserById(this.eventuser._id).subscribe(data1=>{
          var res1:any = {};
          res1 = data1;
          if(res1.success){
            this.authService.updateUser(res1.user);
          }
          else{
            this.router.navigate(['/event/login']);
          }
        })
        this.authService.updateUser(res.user);
        this.flashMessage.success(res.msg,{delay:2000});
      } else{
        this.flashMessage.danger(res.msg,{delay:2000});  
      }
    });
  }
  OnClose(){
    window.history.back();
  }
  OnGetCountries(){
    
  }
}
