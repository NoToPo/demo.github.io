import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtableComponent } from './airtable.component';

describe('AirtableComponent', () => {
  let component: AirtableComponent;
  let fixture: ComponentFixture<AirtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirtableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
