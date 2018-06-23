import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FlashMessage } from 'angular-flash-message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
  	private authService : AuthService,
  	private flashMessage:FlashMessage,
  	private router : Router
  ) { }

  ngOnInit() {
  }

  OnLogout() { 
  	this.authService.logout();
  	this.router.navigate(['/home']);
  	return false;
  }
  OnViewServices(){
    var user = this.authService.getUser();
    this.router.navigate(['/service/view']);
  }
  OnOrganiseEvent(){
    this.router.navigate(['/event/organise']);
  }
}
