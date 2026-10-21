import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasDetalle } from './facturas-detalle';

describe('FacturasDetalle', () => {
  let component: FacturasDetalle;
  let fixture: ComponentFixture<FacturasDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturasDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
