import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSalesChartsComponent } from './store-sales-charts.component';

describe('StoreSalesChartsComponent', () => {
  let component: StoreSalesChartsComponent;
  let fixture: ComponentFixture<StoreSalesChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSalesChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSalesChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
