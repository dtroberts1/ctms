import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMenuTableComponent } from './business-menu-table.component';

describe('BusinessMenuTableComponent', () => {
  let component: BusinessMenuTableComponent;
  let fixture: ComponentFixture<BusinessMenuTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessMenuTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMenuTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
