import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCsvComponent } from '../upload-csv.component';

describe('LoadCsvComponent', () => {
  let component: UploadCsvComponent;
  let fixture: ComponentFixture<UploadCsvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadCsvComponent],
    });
    fixture = TestBed.createComponent(UploadCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
