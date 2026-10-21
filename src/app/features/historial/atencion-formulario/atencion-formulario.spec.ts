import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtencionFormulario } from './atencion-formulario';

describe('AtencionFormulario', () => {
  let component: AtencionFormulario;
  let fixture: ComponentFixture<AtencionFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtencionFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(AtencionFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
