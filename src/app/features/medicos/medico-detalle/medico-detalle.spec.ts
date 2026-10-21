import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicoDetalle } from './medico-detalle';

describe('MedicoDetalle', () => {
  let component: MedicoDetalle;
  let fixture: ComponentFixture<MedicoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
