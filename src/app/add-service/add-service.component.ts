import { Component, OnInit, ElementRef,ViewChild, NgZone  } from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { global } from '../config';
import { } from 'googlemaps';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { ResourceService } from '../services/resource.service'
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  model:any = {};
  uploader:FileUploader = new FileUploader({url:global.siteUrl + "services/upload"});
  attachmentList: any = [];
  public searchControl: FormControl;
  days=[
    {name:"Sunday",classname:{'days':true,'selected':true,'form-control':true}},
    {name:"Monday",classname:{'days':true,'selected':true,'form-control':true}},
    {name:"Tuesday",classname:{'days':true,'selected':true,'form-control':true}},
    {name:"Wednesday",classname:{'days':true,'selected':true,'form-control':true}},
    {name:"Thursday",classname:{'days':true,'selected':true,'form-control':true}},
    {name:"Friday",classname:{'days':true,'selected':true,'form-control':true}},
    {name:"Saturday",classname:{'days':true,'selected':true,'form-control':true}}
  ];
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor(private ngZone: NgZone, private mapsAPILoader: MapsAPILoader,
    private resourceService:ResourceService, private router:Router,private authService:AuthService,private flashMessage : FlashMessage,) { 
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=>{
      this.attachmentList.push(JSON.parse(response));
    }
  }
  ngOnInit() {
    if(!this.authService.loggedIn()){
      this.router.navigate(['/login']);
    }
    this.model.location = {};
    this.setCurrentPosition();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.model.location.lat = place.geometry.location.lat();
          this.model.location.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.model.location.lat = position.coords.latitude;
        this.model.location.lng = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
  onSubmit(){
    window.scrollTo(0, 350);
    
    if(this.model.name == undefined || this.model.price  == undefined || this.model.location  == null || this.model.numberofguests == undefined ){
      this.flashMessage.danger("Fill all fields.");
      return false;
    }
    var user = this.authService.getUser();
    if(user == undefined){
      this.flashMessage.danger("Please log in.");
      this.router.navigate(['/service/login']);
    }
    this.model.user = user._id;
    this.model.images = [];
    this.attachmentList.forEach(element => {
      if(element["success"]){
        this.model.images.push(element["uploadname"])
      }
    });
  
    let answer3 = '{';
    this.days.forEach(element => {
      if(element.classname.selected){
          //this.model.timing3
           let id = element.name + "_start";
           let inputFieldStart = document.getElementById(id) as HTMLInputElement;
           let starttime = inputFieldStart.value;
      
           id = element.name + "_end";
           let inputFieldEnd = document.getElementById(id) as HTMLInputElement;
           let endtime = inputFieldEnd.value;
           if(starttime != "" && endtime != ""){
              answer3 += '"' + element.name + '"' + ':[' + '"' + starttime + '","' + endtime + '"],';
           }
      }
    });
    answer3 = answer3.substring(0, answer3.length - 1);
    answer3 += '}';

    this.model.timing = JSON.parse(answer3);
    if( this.model.timing == undefined || Object.keys(this.model.timing).length < 1){
      this.flashMessage.danger("Set correct timing.");
      return false;
    }
    this.resourceService.addService(this.model).subscribe( data => {
      var res:any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg,{delay:2000});
        this.uploader.clearQueue();
        this.attachmentList = [];
        this.model = {};

        this.days.forEach(element => {
          element.classname.selected=true;
        });
      } else{
        this.flashMessage.danger(res.msg,{delay:2000});  
      }
    });
  }
  toggleClass(index){
    this.days[index].classname["selected"] = !this.days[index].classname["selected"];
  }

}
 