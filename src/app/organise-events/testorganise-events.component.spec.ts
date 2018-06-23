import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganiseEventsComponent } from './organise-events.component';

describe('OrganiseEventsComponent', () => {
  let component: OrganiseEventsComponent;
  let fixture: ComponentFixture<OrganiseEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganiseEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganiseEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
