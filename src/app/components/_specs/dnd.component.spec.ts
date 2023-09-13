import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndComponent } from '../dnd.component';

describe('DndComponent', () => {
  let component: DndComponent;
  let fixture: ComponentFixture<DndComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DndComponent],
    });
    fixture = TestBed.createComponent(DndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
