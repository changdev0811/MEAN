import { Component, OnInit } from '@angular/core';
import { ValidateService} from '../services/validate.service';
import { FlashMessage } from 'angular-flash-message';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EventUser } from '../models/EventUser';
@Component({
  selector: 'app-event-user-log-in',
  templateUrl: './event-user-log-in.component.html',
  styleUrls: ['./event-user-log-in.component.css']
})
export class EventUserLogInComponent implements OnInit {
  eventuser:any = {};
  constructor(
    private authService : AuthService,
  	private flashMessage : FlashMessage,
  	private router : Router
  ) { }

  ngOnInit() {
  }
  OnLoginSubmitTrue(){
		if(!this.eventuser.username || !this.eventuser.password){
			this.flashMessage.danger("Please fill in all fields");
			return;
		}

	var res: any = {};
  	this.authService.authenticateEventUser(this.eventuser).subscribe(data=>{
		res = data;
  		if(res.success){
  			this.authService.saveToken(res.token,res.user);
				this.flashMessage.success('Successfully logged in.');
  			this.router.navigate(['/event']);
  		} else {
				this.flashMessage.danger(res.msg);
  		}
  	});
	}
}
