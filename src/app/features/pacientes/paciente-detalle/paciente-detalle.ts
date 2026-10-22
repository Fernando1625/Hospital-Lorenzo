import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { Paciente } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-paciente-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paciente-detalle.html',
  styleUrl: './paciente-detalle.css',
})
export class PacienteDetalle {
  private route = inject(ActivatedRoute);
  private pacientesService = inject(PacientesService);

  paciente?: Paciente;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id > 0) {
      this.paciente = this.pacientesService.obtenerPacientePorId(id);
    }
  }
}
