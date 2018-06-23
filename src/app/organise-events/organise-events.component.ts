import { Component, OnInit, ViewChildren, QueryList, ElementRef,ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { global } from '../config';
import { } from 'googlemaps';
import { FlashMessage } from 'angular-flash-message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { ResourceService } from '../services/resource.service';
import { Resource } from '../models/resource';
import { Event } from '../models/event';
import { UtilityService } from '../services/utility.service';
import { ListingComponent } from '../listing/listing.component';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { BookingService } from '../services/booking.service';
@Component({
  selector: 'app-organise-events',
  templateUrl: './organise-events.component.html',
  styleUrls: ['./organise-events.component.css']
})
export class OrganiseEventsComponent implements OnInit,AfterViewInit {
  resources=[
    {name:"Catering",classname:{'resource':true,'selected':false, 'form-control':true}},
    {name:"Venue",classname:{'resource':true,'selected':false, 'form-control':true}},
    {name:"DJ",classname:{'resource':true,'selected':false, 'form-control':true}},
    {name:"Music",classname:{'resource':true,'selected':false, 'form-control':true}},
    {name:"Photography",classname:{'resource':true,'selected':false, 'form-control':true}}
  ];  
  @ViewChildren('resource') resourceComponents:QueryList<ListingComponent>;

  generatedIndex={"Catering":0,"Venue":0,"DJ":0,"Music":0,"Photography":0};
  package:any = [];
  public searchControl: FormControl;
  generatedpackage:any = [];
  packagesets:any = []; 
  
  event:any = {};
  bstate = false;
  services:any = [];
  dates:number;
  hours:number;
  total:number;
  fee:number;
  MAX_DATES = 15;
  bregenerate:boolean;
  current:number;
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  public zoom: number;
  bRedirecting = false;
  startsbyID = [];
  @ViewChild("search") public searchElementRef: ElementRef;

  constructor(private ngZone: NgZone, private mapsAPILoader: MapsAPILoader,private router:Router, private route: ActivatedRoute,
    private utilityService:UtilityService,
    private flashMessage: FlashMessage, private authservice:AuthService, private bookingService:BookingService,private resourceService:ResourceService) { }

  ngAfterViewInit(){
    
  }
  ngOnInit() {
    this.OnInit();
  }
  OnInit(){
    let user = this.authservice.getUser();
    if(user == undefined || this.authservice.isServiceProvider()){
      this.router.navigate(['/event/login']);
    }
    this.bRedirecting = false;
    let event_generate = this.bookingService.getPackage();
    if(event_generate != undefined){
      this.event = event_generate.package;
      this.packagesets = event_generate.packagesets;
      this.generatedpackage = event_generate.resources;
      this.bstate = true;
      this.hours = event_generate.hour;
      this.CalculateTotal();
    }
    else{
    this.packagesets = [];
    this.generatedpackage = [];
    this.hours = 0;
    
    this.total = 0;
    this.fee = 0;
    this.event = {};
    this.event.location = {};
    //this.temptimes = Array(this.MAX_DATES).fill({});
    this.event.timing = new Array(this.MAX_DATES);
    for(let i = 0; i < this.MAX_DATES ; i ++)
      this.event.timing[i] = {};

    this.event.dates = {};
    this.searchControl = new FormControl();
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
          this.event.location.latitude = place.geometry.location.lat();
          this.event.location.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
    }
    
    this.package = [];
      
    this.services = [];
    this.dates = -1;
    
  }
  toggleClass(index){
    this.resources[index].classname["selected"] = !this.resources[index].classname["selected"];
  }
  OnClear(){
    this.event.timing = new Array(this.MAX_DATES);
    for(let i = 0; i < this.MAX_DATES ; i ++)
      this.event.timing[i] = {};
    this.event.dates = {};
    this.event.budget = "";
    this.event.numberofguests = "";
    this.event.event_type = "";
    this.dates = -1;
    this.resources.forEach(element => {
      element.classname.selected = false;
    });
  }
  createRange(number){
  var items: number[] = [];
  for(var i = 1; i <= number; i++){
     items.push(i);
  }
  return items;
}
OnGenerate(){ 
 
    this.bstate = false;
    this.hours = 0;
    this.startsbyID = [];
    window.scrollTo(0,150);
   
    if(this.event.range == undefined || this.event.numberofguests == undefined || this.event.location == null 
     || this.event.budget == undefined){
      this.flashMessage.danger("Fill in all fields");
      return false;
    }
    var selectedServices = this.resources.slice(0).filter(item => item.classname.selected == true);
    if((selectedServices.length < 1)){
      this.flashMessage.danger("Select services");
      return false;
    }
   
    for(let i = 0 ; i < this.dates ; i ++){
      if(this.event.timing[i] == undefined || this.event.timing[i].start == undefined || this.event.timing[i].end == undefined){
        
        this.flashMessage.danger("Input time for each date.");
        break;
      }
        var firsttime1 = new Date('1983-2-24');
        var firsttime2 = new Date('1983-2-24');
        firsttime1.setHours(parseInt(this.event.timing[i].start.substr(0,2)));
        firsttime1.setMinutes(parseInt(this.event.timing[i].start.substr(3,2)));
        firsttime2.setHours(parseInt(this.event.timing[i].end.substr(0,2)));
        firsttime2.setMinutes(parseInt(this.event.timing[i].end.substr(3,2)));
        this.hours += Math.round(this.utilityService.GetHours(firsttime2, firsttime1) / (1000 * 60 * 60));
    }
    if(this.hours < 1){
      this.flashMessage.danger("Input correct time");
      return false;
    }
    this.packagesets = [];
    this.generatedpackage = [];
    
    for(let i = 0; i < selectedServices.length; i ++){
      this.event.service = selectedServices[i].name;
      this.package = [];
      this.resourceService.getResourcesByEvent(this.event).subscribe(data=> {
        var res:any = {};
        res = data;
        this.package = res.resources;
        
        if(this.package != undefined && this.package.length > 0){
          let filtered = [];
          this.package.forEach(element => {
            const from = new google.maps.LatLng(this.event.location.latitude, this.event.location.longitude);
            const to = new google.maps.LatLng(element.location.lat, element.location.lng);
    
            const distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
        //    if(distance <= Number.parseInt(this.event.range) * 1000){
              filtered.push(element);
        //    }
          });
          if(filtered.length > 0){
            
            // this.updateSort(filtered);
            // for(let i = 0; i < filtered.length - 1; i ++){
            //   for(let j = i + 1;j < filtered.length; j ++)
            //   {
            //     console.log( filtered[i]._id + " , " +  filtered[j]._id);
            //     console.log(this.startsbyID[0]);
            //     // let a = this.startsbyID.slice(0).filter(ret => ret.id == filtered[i]._id);
            //     // let b = this.startsbyID.slice(0).filter(ret => ret.id == filtered[j]._id);
                
            //     // if(a[0].stars < b[0].stars){
            //     //   let temp = filtered[i];
            //     //   filtered[i] = filtered[j];
            //     //   filtered[j] = temp;
            //     // }
            //   }
            // }
            
            this.packagesets.push(filtered);
            this.generatedpackage.push(filtered[0]);
            this.bstate = true;
            this.CalculateTotal();
          }
          
        }
        
      })
    }
    
  }
  async updateSort(filtered){
    for(let i = 0; i < filtered.length ; i ++){
      let FeedbackObj_a:any = {};
      FeedbackObj_a = await this.bookingService.getOverallRanking(filtered[i]._id);
      this.startsbyID.push({id:filtered[i]._id, stars:FeedbackObj_a.stars});
      console.log(this.startsbyID.length);
    }
    console.log("returend");
  }
  // async  sortResource(a,b){
  //   let FeedbackObj_a:any = {};
  //   FeedbackObj_a = await this.bookingService.getOverallRanking(a['_id']);
  //   let FeedbackObj_b:any = {};
  //   FeedbackObj_b = await this.bookingService.getOverallRanking(b['_id']);
  //   console.log("returned");
  //   if(FeedbackObj_a.stars > FeedbackObj_b.stars) return Promise.resolve(1);
  //   else if(FeedbackObj_a.stars < FeedbackObj_b.stars) return Promise.resolve(-1);
  //   return Promise.resolve(0);
  // }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
  OnPay(){
    this.packagesets.forEach((element,i) => {
      element.forEach(sub_element => {
        if(sub_element == this.generatedpackage[i]){
          this.resourceService.addAnalysis({id:sub_element._id, name:"chosen"}).subscribe(data =>{});

        }else{
          this.resourceService.addAnalysis({id:sub_element._id, name:"skipped"}).subscribe(data =>{});
        }
      });
    });
    this.bRedirecting = false;
    this.bookingService.pay(this.total + this.fee).subscribe(data => {
      let res:any = {};
      res = data;
      if(res.success){
        let gen_resources = this.generatedpackage;//.map( (item,index) => {return item._id});
        let event_generate = this.bookingService.getPackage();
        this.event.timing = this.event.timing.slice(0, this.dates);
        if(event_generate == undefined) {         
          this.bookingService.savePackage({"price":this.total + this.fee,"package":this.event, "hour":this.hours,"packagesets":this.packagesets, "resources":gen_resources});
         }else{
          this.bookingService.freePackage();
          event_generate.price = this.total + this.fee;
          event_generate.resources = gen_resources;
          this.bookingService.savePackage(event_generate);
         }
        this.bRedirecting = true;
        window.location.href=res.approval_url;
      }
      else{
        this.flashMessage.danger("Payment Failed");
      }
    });
  }
  OnBack(){
    this.bstate = false;
    this.bRedirecting = false;
    this.bookingService.freePackage();
  }
  OnEndDate(){
    if(this.event.dates.start == undefined || this.event.dates.end == undefined)
      return;
    // var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    // var firstDate = this.event.dates.start;
    // var secondDate = this.event.dates.end;
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var secondDate = new Date(this.event.dates.start.slice(0,10));
    var firstDate = new Date(this.event.dates.end.slice(0,10));
    this.dates = Math.round(this.utilityService.GetHours(firstDate, secondDate) / (oneDay)) + 1;
  }
  getFee(value:number){
    let fee = value * 0.03 + 0.50;
    fee = Math.round(fee * 100) / 100;
    return fee;
  }
  CalculateTotal(){
      this.total = 0;
      this.generatedpackage.forEach(element => {
        this.total += element.price * this.hours;
      });
      this.fee = this.getFee(this.total);
  }
  getDate(i){
    let startDate = new Date(this.event.dates['start']);
    startDate.setDate(startDate.getDate() + i);
    let month = startDate.getMonth() + 1;
    return startDate.getFullYear() + "-" + month + "-" + startDate.getDate();
  }
  OnRegenerate(){
    this.resourceComponents.forEach(element => {
      element.Regenerate();
    });
  }
  onRegenerated(resource:Resource){
    for(let i = 0 ; i < this.generatedpackage.length ; i ++){
      if(this.generatedpackage[i].name == resource.name){
        this.generatedpackage[i] = resource;
      }
    }
    this.CalculateTotal();
  }
}
