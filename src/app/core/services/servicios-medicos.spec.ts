import { TestBed } from '@angular/core/testing';
import { ServiciosMedicos } from './servicios-medicos';

describe('ServiciosMedicos', () => {
  let service: ServiciosMedicos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosMedicos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
