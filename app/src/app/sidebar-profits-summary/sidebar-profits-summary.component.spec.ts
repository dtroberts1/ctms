import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarProfitsSummaryComponent } from './sidebar-profits-summary.component';

describe('SidebarProfitsSummaryComponent', () => {
  let component: SidebarProfitsSummaryComponent;
  let fixture: ComponentFixture<SidebarProfitsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarProfitsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarProfitsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
