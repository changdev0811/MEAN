import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessageModule } from 'angular-flash-message';
import { JwtModule   } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';


import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ForgotService } from './services/forgot.service';
import { ServiceProvierComponent } from './service-provier/service-provier.component';


import { AgmCoreModule } from '@agm/core';
import { FileUploadModule} from 'ng2-file-upload'
import { AddServiceComponent } from './add-service/add-service.component';
import { ResourceService } from './services/resource.service';

import { EventorganiserComponent } from './eventorganiser/eventorganiser.component';
import { EventUserLogInComponent } from './event-user-log-in/event-user-log-in.component';
import { ServiceUserLogInComponent } from './service-user-log-in/service-user-log-in.component';
import { EventUserRegisterComponent } from './event-user-register/event-user-register.component';
import { EventUserForgotComponent } from './event-user-forgot/event-user-forgot.component';
import { ServiceUserForgotComponent } from './service-user-forgot/service-user-forgot.component';
import { EventUserResetComponent } from './event-user-reset/event-user-reset.component';
import { ServiceUserResetComponent } from './service-user-reset/service-user-reset.component';
import { ServiceUserRegisterComponent } from './service-user-register/service-user-register.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { ViewServicesComponent } from './view-services/view-services.component';
import { OrganiseEventsComponent } from './organise-events/organise-events.component';
import { ServiceUserProfileComponent } from './service-user-profile/service-user-profile.component';
import { EventUserProfileComponent } from './event-user-profile/event-user-profile.component';
import { UtilityService } from './services/utility.service';
import { ListingComponent } from './listing/listing.component';
import { PaidService } from './services/paid.service';
import { AnalysisComponent } from './analysis/analysis.component';
import { ChartsModule } from 'ng2-charts';
import { BookingService } from './services/booking.service';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { PaySuccessComponent } from './pay-success/pay-success.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { Page404Component } from './page404/page404.component';
import { StarRatingModule } from 'angular-star-rating';
import { MyBookingResourceComponent } from './my-booking-resource/my-booking-resource.component';
import { ServiceAuthGuardService } from './services/service-auth-guard.service';
import { EventAuthGuardService } from './services/event-auth-guard.service';
import { ContactUsComponent } from './contact-us/contact-us.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent, 
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ServiceProvierComponent,
    AddServiceComponent,
    EventorganiserComponent,
    EventUserLogInComponent,
    ServiceUserLogInComponent,
    EventUserRegisterComponent,
    EventUserForgotComponent,
    ServiceUserForgotComponent,
    EventUserResetComponent,
    ServiceUserResetComponent,
    ServiceUserRegisterComponent,
    EditServiceComponent,
    ViewServicesComponent,
    OrganiseEventsComponent,
    ServiceUserProfileComponent,
    EventUserProfileComponent,
    ListingComponent,
    AnalysisComponent,
    MyBookingComponent,
    PaySuccessComponent,
    SummaryPageComponent,
    Page404Component,
    MyBookingResourceComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    FlashMessageModule,
    StarRatingModule.forRoot(),
    HttpClientModule,
    FileUploadModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDKrYAO4xKHiXKiGpKrNYR_O86z0uHrhGU',
      libraries: ["places,geometry"]
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('id_token');
        },
        whitelistedDomains: ['localhost:4200']
      }
    }) 
  ],
  providers: [ServiceAuthGuardService, EventAuthGuardService, BookingService, ValidateService,AuthService,ForgotService, ResourceService, UtilityService, PaidService],
  bootstrap: [AppComponent]
})
export class AppModule { }
