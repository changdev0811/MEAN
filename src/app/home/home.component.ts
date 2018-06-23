import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { UtilityService} from '../services/utility.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router, private utilityService:UtilityService) { }

  ngOnInit() {
    if(this.authService.isServiceProvider()){
        this.router.navigate(['/service']);
    }
    if(this.authService.isEventOrganiser()){
      this.router.navigate(['/event']);
  }
  }

}
