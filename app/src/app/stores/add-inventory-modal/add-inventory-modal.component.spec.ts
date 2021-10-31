import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryModalComponent } from './add-inventory-modal.component';

describe('AddInventoryModalComponent', () => {
  let component: AddInventoryModalComponent;
  let fixture: ComponentFixture<AddInventoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInventoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
