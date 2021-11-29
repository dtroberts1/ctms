import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarServiceSummaryComponent } from './sidebar-service-summary.component';

describe('SidebarServiceSummaryComponent', () => {
  let component: SidebarServiceSummaryComponent;
  let fixture: ComponentFixture<SidebarServiceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarServiceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarServiceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
