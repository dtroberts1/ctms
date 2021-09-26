import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMenuComponent } from './business-menu.component';

describe('BusinessMenuComponent', () => {
  let component: BusinessMenuComponent;
  let fixture: ComponentFixture<BusinessMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
