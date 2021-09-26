import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMenuOverviewComponent } from './business-menu-overview.component';

describe('BusinessMenuOverviewComponent', () => {
  let component: BusinessMenuOverviewComponent;
  let fixture: ComponentFixture<BusinessMenuOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessMenuOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMenuOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
