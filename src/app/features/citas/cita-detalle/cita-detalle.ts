import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CitasService } from '../../../core/services/citas';
import { PacientesService } from '../../../core/services/pacientes';
import { MedicosService } from '../../../core/services/medicos';

@Component({
  selector: 'app-cita-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cita-detalle.html',
  styleUrl: './cita-detalle.css',
})
export class CitaDetalle {
  private route = inject(ActivatedRoute);
  private citasService = inject(CitasService);
  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);

  cita = this.citasService.obtenerCitaPorId(Number(this.route.snapshot.paramMap.get('id')));

  get paciente() {
    return this.cita ? this.pacientesService.obtenerPacientePorId(this.cita.pacienteId) : undefined;
  }

  get medico() {
    return this.cita ? this.medicosService.obtenerMedicoPorId(this.cita.medicoId) : undefined;
  }

  get permiteReprogramar(): boolean {
    return this.cita ? ['Programada', 'Confirmada'].includes(this.cita.estado) : false;
  }
}
