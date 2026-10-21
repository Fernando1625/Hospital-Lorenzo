import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitaDetalle } from './cita-detalle';

describe('CitaDetalle', () => {
  let component: CitaDetalle;
  let fixture: ComponentFixture<CitaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
