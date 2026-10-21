import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasFormulario } from './facturas-formulario';

describe('FacturasFormulario', () => {
  let component: FacturasFormulario;
  let fixture: ComponentFixture<FacturasFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
