import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WateringsComponent } from './waterings.component';

describe('WateringsComponent', () => {
  let component: WateringsComponent;
  let fixture: ComponentFixture<WateringsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WateringsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WateringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
