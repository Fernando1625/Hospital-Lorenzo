import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { MedicosService } from '../../../core/services/medicos';
import { HistorialService } from '../../../core/services/historial';

@Component({
  selector: 'app-historial-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './historial-detalle.html',
  styleUrl: './historial-detalle.css',
})
export class HistorialDetalle {
  private route = inject(ActivatedRoute);
  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);
  private historialService = inject(HistorialService);

  // Obtener identificador de la ruta
  pacienteId = Number(this.route.snapshot.paramMap.get('id'));

  // Obtener información del paciente
  paciente = this.pacientesService.obtenerPacientePorId(this.pacienteId);

  // Consultar las atenciones vinculadas con el paciente
  atenciones = computed(() =>
    this.historialService
      .atenciones()
      .filter((atencion) => atencion.pacienteId === this.pacienteId)
      .sort((a, b) => b.fechaAtencion.localeCompare(a.fechaAtencion) || b.id - a.id),
  );

  // Consultar el médico responsable
  nombreMedico(medicoId: number): string {
    const medico = this.medicosService.obtenerMedicoPorId(medicoId);

    if (!medico) {
      return 'Médico no encontrado';
    }

    return `${medico.nombres} ${medico.apellidos}`;
  }
}
