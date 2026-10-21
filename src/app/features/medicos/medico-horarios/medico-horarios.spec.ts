import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicoHorarios } from './medico-horarios';

describe('MedicoHorarios', () => {
  let component: MedicoHorarios;
  let fixture: ComponentFixture<MedicoHorarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoHorarios],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoHorarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
