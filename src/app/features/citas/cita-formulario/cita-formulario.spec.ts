import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitaFormulario } from './cita-formulario';

describe('CitaFormulario', () => {
  let component: CitaFormulario;
  let fixture: ComponentFixture<CitaFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
