import { Component, OnInit } from '@angular/core';
import { FlashMessage } from 'angular-flash-message';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { EventUser } from '../models/EventUser';
import { ServiceUser } from '../models/ServiceUser';
@Component({
  selector: 'app-service-user-log-in',
  templateUrl: './service-user-log-in.component.html',
  styleUrls: ['./service-user-log-in.component.css']
})
export class ServiceUserLogInComponent implements OnInit {
  serviceuser:any = {};
  constructor(
    private authService : AuthService,
  	private flashMessage : FlashMessage,
  	private router : Router
  ) { }

  ngOnInit() {
  }
  OnLoginSubmitFalse(){
		if(!this.serviceuser.username || !this.serviceuser.password){
			this.flashMessage.danger("Please fill in all fields");
			return;
		}

	var res: any = {};
  	this.authService.authenticateServiceUser(this.serviceuser).subscribe(data=>{
		res = data;
  		if(res.success){
  			this.authService.saveToken(res.token,res.user);
				this.flashMessage.success('Successfully logged in.');
  			this.router.navigate(['/service']);
  		} else {
				this.flashMessage.danger(res.msg);
  		}
  	});
	}
}
