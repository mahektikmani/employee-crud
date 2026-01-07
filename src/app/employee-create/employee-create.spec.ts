import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreate } from './employee-create';

describe('EmployeeCreate', () => {
  let component: EmployeeCreate;
  let fixture: ComponentFixture<EmployeeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
