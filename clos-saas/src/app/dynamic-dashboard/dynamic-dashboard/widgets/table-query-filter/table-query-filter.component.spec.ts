import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableQueryFilterComponent } from './table-query-filter.component';

describe('TableQueryFilterComponent', () => {
  let component: TableQueryFilterComponent;
  let fixture: ComponentFixture<TableQueryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableQueryFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableQueryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
