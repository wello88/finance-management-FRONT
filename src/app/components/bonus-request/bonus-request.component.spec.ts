import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusRequestComponent } from './bonus-request.component';

describe('BonusRequestComponent', () => {
  let component: BonusRequestComponent;
  let fixture: ComponentFixture<BonusRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
