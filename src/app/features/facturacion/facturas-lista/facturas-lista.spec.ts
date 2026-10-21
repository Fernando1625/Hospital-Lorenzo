import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasLista } from './facturas-lista';

describe('FacturasLista', () => {
  let component: FacturasLista;
  let fixture: ComponentFixture<FacturasLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasLista],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
