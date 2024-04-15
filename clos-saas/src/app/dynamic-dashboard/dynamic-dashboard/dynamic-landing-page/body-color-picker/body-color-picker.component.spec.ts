import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyColorPickerComponent } from './body-color-picker.component';

describe('BodyColorPickerComponent', () => {
  let component: BodyColorPickerComponent;
  let fixture: ComponentFixture<BodyColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodyColorPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
