import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartHeaderComponent } from '../chart-header.component';

describe('ChartHeaderComponent', () => {
  let component: ChartHeaderComponent;
  let fixture: ComponentFixture<ChartHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartHeaderComponent],
    });
    fixture = TestBed.createComponent(ChartHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
