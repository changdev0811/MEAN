import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingResourceComponent } from './my-booking-resource.component';
import { FlashMessage } from 'angular-flash-message';
describe('MyBookingResourceComponent', () => {
  let component: MyBookingResourceComponent;
  let fixture: ComponentFixture<MyBookingResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBookingResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBookingResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 
});
