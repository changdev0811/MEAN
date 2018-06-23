import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { ResourceService } from '../services/resource.service'
import { Resource } from '../models/resource'
import { Event } from '../models/event'
import { BookingService } from '../services/booking.service'
@Component({
  selector: 'app-eventorganiser',
  templateUrl: './eventorganiser.component.html',
  styleUrls: ['./eventorganiser.component.css']
})
export class EventorganiserComponent implements OnInit {

  classng = "label label-warning";
  resources=[
    {name:"Catering",classname:{'label':true, 'label-warning':true, 'label-success':false}},
    {name:"Venue",classname:{'label':true, 'label-warning':true, 'label-success':false}},
    {name:"DJ",classname:{'label':true, 'label-warning':true, 'label-success':false}},
    {name:"Music",classname:{'label':true, 'label-warning':true, 'label-success':false}},
    {name:"Photography",classname:{'label':true, 'label-warning':true, 'label-success':false}}
  ];
  package = [];
  event:any = {};
  user_id:String;
  Name:String;
  constructor(private bookingService:BookingService,private router:Router, private route: ActivatedRoute,
    private flashMessage: FlashMessage, private authservice:AuthService, private resourceService:ResourceService) { }

  
  ngOnInit() {
    var user = this.authservice.getUser();
    if(user == undefined){
      this.router.navigate(['/event/login']);
    }
    this.Name = user.firstname + "  " + user.lastname;

    
  }
  toggleClass(index){
    if(this.resources[index].classname["label-warning"]){
      this.resources[index].classname["label-warning"] = false;
      this.resources[index].classname["label-success"] = true;
    }
    else{
      this.resources[index].classname["label-warning"] = true;
      this.resources[index].classname["label-success"] = false;
    }
  }
  OnClear(){
    this.event = {};
    this.package = [];
    this.resources.forEach(element => {
      element.classname = {'label':true, 'label-warning':true, 'label-success':false};
    });
  }
  OnGenerate(){
    this.package = [];
     this.resources.forEach(element => {
       if(element.classname["label-success"]){
          this.resourceService.getResourceByName(element.name).subscribe(resource => 
          {          
            var res:any = {};
            res = resource;
            if(res != null){
              this.package.push(res.resource);
            }
          });
       }
     });
     this.flashMessage.success("Package generated",1000);
  }
  hasResources(){
    return this.package != undefined && this.package.length > 0;
  }
}
