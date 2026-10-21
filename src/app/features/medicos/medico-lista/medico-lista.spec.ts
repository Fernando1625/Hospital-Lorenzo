import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicoLista } from './medico-lista';

describe('MedicoLista', () => {
  let component: MedicoLista;
  let fixture: ComponentFixture<MedicoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
