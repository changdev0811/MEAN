import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { ResourceService } from '../services/resource.service'
import { Resource } from '../models/resource'
import { BookingService } from '../services/booking.service'
@Component({
  selector: 'app-service-provier',
  templateUrl: './service-provier.component.html',
  styleUrls: ['./service-provier.component.css']
})
export class ServiceProvierComponent implements OnInit {
  resources:any = [];
  private sub: any;  
  constructor(private bookingService:BookingService,private router:Router, private route: ActivatedRoute,
              private flashMessage: FlashMessage, private authservice:AuthService, private resourceService:ResourceService) { 
    
  }
  
  ngOnInit() {
    this.resources = [];
    if(!this.authservice.loggedIn()){ 
      this.router.navigate(['/service/login']);
     }
    this.sub =  this.route.params.subscribe(params => {

      var user = this.authservice.getUser();
      this.resourceService.getResourcesByUser(user._id).subscribe(resources => 
        {          
          var res:any = {};
          res = resources;
          this.resources = res.resources;
         
        });
    });
  
  }
  
  hasResources(){
    return this.resources != undefined && this.resources.length > 0;
  }
}
