import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ServiceProvierComponent } from './service-provier/service-provier.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { EventorganiserComponent } from './eventorganiser/eventorganiser.component';
import { EventUserRegisterComponent } from './event-user-register/event-user-register.component';
import { ServiceUserRegisterComponent } from './service-user-register/service-user-register.component';
import { EventUserLogInComponent } from './event-user-log-in/event-user-log-in.component';
import { ServiceUserLogInComponent } from './service-user-log-in/service-user-log-in.component';
import { ServiceUserForgotComponent } from './service-user-forgot/service-user-forgot.component';
import { EventUserForgotComponent } from './event-user-forgot/event-user-forgot.component';
import { EventUserResetComponent } from './event-user-reset/event-user-reset.component';
import { ServiceUserResetComponent } from './service-user-reset/service-user-reset.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { ViewServicesComponent } from './view-services/view-services.component';
import { OrganiseEventsComponent } from './organise-events/organise-events.component';
import { ServiceUserProfileComponent } from './service-user-profile/service-user-profile.component';
import { EventUserProfileComponent } from './event-user-profile/event-user-profile.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { MyBookingComponent } from './my-booking/my-booking.component'
import { PaySuccessComponent } from './pay-success/pay-success.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { Page404Component } from './page404/page404.component';
import { MyBookingResourceComponent } from './my-booking-resource/my-booking-resource.component'
import { EventAuthGuardService }                from './services/event-auth-guard.service';
import { ServiceAuthGuardService }                from './services/service-auth-guard.service';
import { ContactUsComponent } from './contact-us/contact-us.component';
const routes : Routes=[
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'contactus', component:ContactUsComponent},
  {path:'service', component:ViewServicesComponent,canActivate: [ServiceAuthGuardService]},
  {path:'service/addservice',component:AddServiceComponent,canActivate: [ServiceAuthGuardService]},
  {path:'service/register', component:ServiceUserRegisterComponent},
  {path:'service/analysis/:id', component:AnalysisComponent,canActivate: [ServiceAuthGuardService]},
  {path:'service/profile', component:ServiceUserProfileComponent,canActivate: [ServiceAuthGuardService]},
  {path:'service/reset/:token',component:ServiceUserResetComponent},
  {path:'service/editservice/:id', component:EditServiceComponent,canActivate: [ServiceAuthGuardService]},
  {path:'service/mybooking', component:MyBookingResourceComponent,canActivate: [ServiceAuthGuardService]},
  {path:'service/forgot', component:ServiceUserForgotComponent},
  {path:'service/login', component:ServiceUserLogInComponent},
  {path:'service/view',component:ServiceProvierComponent,canActivate: [ServiceAuthGuardService]},
  {path:'event/reset/:token',component:EventUserResetComponent},
  {path:'event/register', component:EventUserRegisterComponent},
  {path:'event/profile', component:EventUserProfileComponent,canActivate: [EventAuthGuardService]},
  {path:'event/login', component:EventUserLogInComponent},
  
  {path:'event/forgot', component:EventUserForgotComponent},
  {path:'event/organise',component:OrganiseEventsComponent,canActivate: [EventAuthGuardService]},
  {path:'event/mybooking', component:MyBookingComponent,canActivate: [EventAuthGuardService]}, 
  {path:'event', component:EventorganiserComponent,canActivate: [EventAuthGuardService]},

  {path:'events/:id', component:SummaryPageComponent},
  {path:'pay/success', component:PaySuccessComponent},
  {path:'404', component:Page404Component},
  {path:'',component:HomeComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
  	RouterModule
  ]
})

export class AppRoutingModule { }
