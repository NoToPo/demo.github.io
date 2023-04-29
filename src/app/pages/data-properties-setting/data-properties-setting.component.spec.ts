import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPropertiesSettingComponent } from './data-properties-setting.component';

describe('DataPropertiesSettingComponent', () => {
  let component: DataPropertiesSettingComponent;
  let fixture: ComponentFixture<DataPropertiesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPropertiesSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPropertiesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
