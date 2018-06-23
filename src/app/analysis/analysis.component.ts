import { Component, OnInit, ViewChild } from '@angular/core';
import { global } from '../config';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { FlashMessage } from 'angular-flash-message';
import { ResourceService } from '../services/resource.service'
import { resource } from 'selenium-webdriver/http';
import { BookingService } from '../services/booking.service'
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  resource:any = {};
  chartOptions = {
    responsive: true
  };
  money = 0;
  selectedYear = 0;
  years:any = [];
  time = 0;
  generated = 0;
  facebook = 0;
  twitter = 0;
  regenerated = 0;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  chartData = [
    { data: [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], label: 'Earned' },
    { data: [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], label: 'Purchased Time' },
    { data: [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], label: 'Chosen' },
    { data: [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], label: 'Skipped' },
    { data: [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], label: 'Facebook' },
    { data: [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], label: 'Twitter' }
  ];

  chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 
                  'Oct', 'Nov','Dec'];

  constructor(private bookingService:BookingService,private route:ActivatedRoute,private resourceService:ResourceService, private router:Router,private authService:AuthService,private flashMessage : FlashMessage,) { }
  suggestions:any = [];
  progress = 100;
  redraw = false;
  ngOnInit() {
    /* Years to analysis */
    let now = new Date();
    this.selectedYear = now.getFullYear();
    this.years = [];
    for(let i = 0; i < 5; i ++){
      this.years.push(now.getFullYear() - i);
    }
    let id = this.route.snapshot.params['id'];
    this.resourceService.getResourceById(id).subscribe((data) =>{
      var res:any = {};
      res = data;
      if(res.success){
       
        this.resource = res.resource;
        this.generated = this.resource.generated == undefined?0:this.resource.generated;
        this.regenerated = this.resource.regenerated== undefined?0:this.resource.regenerated;
  
        this.getAnalysis();
        if(this.resource.images.length < 1){
          this.progress -= 10;
          this.suggestions.push({name:"Pictures",text:"Add pictures as this makes users more visually great about your service"});
        }
        if(this.resource.description == undefined || this.resource.description == ""){
          this.progress -= 10;
          this.suggestions.push({name:"Description",text:"Add a description so people know what you are offering. Descriptions help people choose if the service is right for them"});
        }
        if(this.resource.location == undefined || this.resource.location == ""){
          this.progress -= 10;
          this.suggestions.push({name:"Location",text:"Add a location so people know where you are offering."});
        }
        if(this.resource.numberofguests == undefined || this.resource.numberofguests == ""){
          this.progress -= 10;
          this.suggestions.push({name:"Numberofguests",text:"Add a number of guests so people know how much you are capable of."});
        }
        if(this.resource.timing == undefined || this.resource.timing == ""){
          this.progress = 0;
          this.suggestions.push({name:"Time",text:"Please add timing availability."});
        }
        if(this.resource.timing == undefined || this.resource.timing == ""){
          this.progress = 0;
          this.suggestions.push({name:"Days",text:"Please add days availability."});
        }
        if(this.progress == 100){
          let index = Math.round(Math.random() * 10) % 3;
          if(index == 0) this.suggestions.push("Maybe you would like to upgrade your pictures and description from time to time");
          else if(index == 1) this.suggestions.push("Extend your timings to make your service more available  and see how your listing will expand");
          else this.suggestions.push("Think about your pricing, is it attractive to the customer? Pricing affects people in their decision making. But otherwise your service looks Great!");
        }
      }else{
        
      }
    });
   }
   selectYear(i){
     this.selectedYear = this.years[i];
     this.getAnalysis();
   }
   getAnalysis(){
     this.time = this.money = 0;
    this.chartLabels.forEach( (element,i) => {
      this.resourceService.getAnalysis({id:this.resource._id,month:i + 1,year:this.selectedYear}).subscribe(res => {
        if(res['success']){
          this.chartData[2].data[res['month'] - 1] = res['chosen'];
          this.chartData[3].data[res['month'] - 1] = res['skipped'];
          this.chartData[2].data[res['month'] - 1] = res['facebook'];
          this.chartData[3].data[res['month'] - 1] = res['twitter'];
          
          this.generated += res['chosen'];
          this.regenerated += res['skipped'];
          this.facebook += res['facebook'];
          this.twitter += res['twitter'];

        }else{
          this.chartData[2].data[res['month'] - 1] = this.chartData[3].data[res['month']] = 0;
        }
        this.chartData = this.chartData.slice();
      });
      this.bookingService.getAnalysis({id:this.resource._id,month:i + 1,year:this.selectedYear}).subscribe(data=>{
        var res:any = {};
        res = data;
        if(res.success){
          this.chartData[1].data[res.month - 1] = res.time;
          this.chartData[0].data[res.month - 1] = res.money;
          this.money += res.money;
          
          this.time += res.time;
        }else{
          this.chartData[0].data[res.month - 1] = this.chartData[1].data[res.month] = 0;
        }
        this.chartData = this.chartData.slice();
      });
    });
   }
}
