import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLandingPageComponent } from './dynamic-landing-page.component';

describe('DynamicLandingPageComponent', () => {
  let component: DynamicLandingPageComponent;
  let fixture: ComponentFixture<DynamicLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
