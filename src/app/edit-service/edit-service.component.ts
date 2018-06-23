import { Component, OnInit, ElementRef,ViewChild, NgZone} from '@angular/core';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { global } from '../config';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { ResourceService } from '../services/resource.service'
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {
  model:any = {};
  uploader:FileUploader = new FileUploader({url:global.siteUrl + "services/upload"});
  attachmentList: any = [];
  removedImages:any = [];
  resoure_id:String;
  siteURL:String;
  public searchControl: FormControl;
  days=[
    {name:"Sunday",classname:{'days':true,'selected':false,'form-control':true}},
    {name:"Monday",classname:{'days':true,'selected':false,'form-control':true}},
    {name:"Tuesday",classname:{'days':true,'selected':false,'form-control':true}},
    {name:"Wednesday",classname:{'days':true,'selected':false,'form-control':true}},
    {name:"Thursday",classname:{'days':true,'selected':false,'form-control':true}},
    {name:"Friday",classname:{'days':true,'selected':false,'form-control':true}},
    {name:"Saturday",classname:{'days':true,'selected':false,'form-control':true}}
  ];
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private ngZone: NgZone, private mapsAPILoader: MapsAPILoader,private route:ActivatedRoute,private resourceService:ResourceService, private router:Router,private authService:AuthService,private flashMessage : FlashMessage) { 
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=>{
      this.attachmentList.push(JSON.parse(response));
    }
  }
  ngOnInit() {
    if(!this.authService.loggedIn()){
      this.router.navigate(['/login']);
    }
    this.model.images = [];
    this.resoure_id = this.route.snapshot.params['id'];
    
    this.siteURL = global.siteUrl;
    this.resourceService.getResourceById(this.resoure_id).subscribe((data) =>{
      var res:any = {};
      res = data;
      if(res.success){
        this.model = res.resource;
        this.removedImages = [];
        this.latitude = res.resource.location.lat;
        this.longitude = res.resource.location.lng;
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
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 12;
            });
          });
        });
        for(let i = 0;i < this.days.length; i ++){
          let element = res.resource.timing[this.days[i].name];
          if(element != undefined && element.length == 2){
            this.days[i].classname.selected = true;
            let id = this.days[i].name + "_start";
            let inputFieldStart = document.getElementById(id) as HTMLInputElement;
            inputFieldStart.value = element[0];

            id = this.days[i].name + "_end";
            let inputFieldEnd = document.getElementById(id) as HTMLInputElement;
            inputFieldEnd.value = element[1];
          }
        }
      }
      
    });
  }
  onSubmit(){
    window.scrollTo(0, 500);
    if(this.model.name == undefined ||  this.model.price == undefined){
      this.flashMessage.danger("Fill all fields.");
      return false;
    }
    var user = this.authService.getUser();
    if(user == undefined){
      this.flashMessage.danger("Please log in.");
      this.router.navigate(['/service/login']);
    }
    this.model.user = user._id;
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
    this.model.location = {"lat":this.latitude,"lng":this.longitude};


    this.resourceService.editService(this.model).subscribe( data => {
      var res:any = {};
      res = data;
      if(res.success){
        this.flashMessage.success(res.msg,{delay:2000});
        this.uploader.clearQueue();
      } else{
        this.flashMessage.danger(res.msg,{delay:2000});  
      }
    });
  }
  toggleClass(index){
    this.days[index].classname["selected"] = !this.days[index].classname["selected"];
  }
  OnRemove(i){
    this.removedImages.push(this.model.images.splice(i, 1));
  }
  OnRefresh(){
    
  }
  OnGoBack(){
    var removedimage = this.removedImages.pop();
    if(removedimage != undefined){
      this.model.images.push(removedimage);
    }
  }

}
