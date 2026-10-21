import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialLista } from './historial-lista';

describe('HistorialLista', () => {
  let component: HistorialLista;
  let fixture: ComponentFixture<HistorialLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialLista],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
