import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDropdown } from '../filter-dropdown';

describe('PaymentTableHeaderComponent', () => {
  let component: FilterDropdown;
  let fixture: ComponentFixture<FilterDropdown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDropdown],
    });
    fixture = TestBed.createComponent(FilterDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
