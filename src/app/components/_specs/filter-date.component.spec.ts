import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDateComponent } from '../filter-date.component';

describe('FilterDateComponent', () => {
  let component: FilterDateComponent;
  let fixture: ComponentFixture<FilterDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDateComponent],
    });
    fixture = TestBed.createComponent(FilterDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
