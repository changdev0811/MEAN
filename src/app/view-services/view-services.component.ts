import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { ResourceService } from '../services/resource.service'
import { Resource } from '../models/resource'
@Component({
  selector: 'app-view-services',
  templateUrl: './view-services.component.html',
  styleUrls: ['./view-services.component.css']
})
export class ViewServicesComponent implements OnInit {
  Name:String;
  constructor(private router:Router, private route: ActivatedRoute,
    private flashMessage: FlashMessage, private authservice:AuthService, private resourceService:ResourceService) { }

  ngOnInit() {
      var user = this.authservice.getUser();
      this.Name = user.firstname + "  " + user.lastname;
  }

}
