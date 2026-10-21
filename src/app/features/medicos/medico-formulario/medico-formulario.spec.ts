import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicoFormulario } from './medico-formulario';

describe('MedicoFormulario', () => {
  let component: MedicoFormulario;
  let fixture: ComponentFixture<MedicoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
