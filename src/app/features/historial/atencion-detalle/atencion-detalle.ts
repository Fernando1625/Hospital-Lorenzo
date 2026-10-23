import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { HistorialService } from '../../../core/services/historial';
import { PacientesService } from '../../../core/services/pacientes';
import { MedicosService } from '../../../core/services/medicos';
import { CitasService } from '../../../core/services/citas';

@Component({
  selector: 'app-atencion-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './atencion-detalle.html',
  styleUrl: './atencion-detalle.css',
})
export class AtencionDetalle {
  private route = inject(ActivatedRoute);
  private historialService = inject(HistorialService);
  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);
  private citasService = inject(CitasService);

  // Obtener los identificadores desde la URL
  pacienteId = Number(this.route.snapshot.paramMap.get('id'));

  atencionId = Number(this.route.snapshot.paramMap.get('atencionId'));

  // Buscar la atención
  private atencionEncontrada = this.historialService.obtenerAtencionPorId(this.atencionId);

  // Verificar que la atención pertenece al paciente
  atencion =
    this.atencionEncontrada?.pacienteId === this.pacienteId ? this.atencionEncontrada : undefined;

  // Obtener el paciente
  paciente = this.atencion
    ? this.pacientesService.obtenerPacientePorId(this.pacienteId)
    : undefined;

  // Obtener el médico responsable
  medico = this.atencion
    ? this.medicosService.obtenerMedicoPorId(this.atencion.medicoId)
    : undefined;

  // Obtener la cita relacionada, cuando exista
  cita =
    this.atencion?.citaId != null
      ? this.citasService.obtenerCitaPorId(this.atencion.citaId)
      : undefined;

  // Formatear mediciones opcionales
  mostrarMedicion(valor: number | string | null, unidad = ''): string {
    if (valor === null || valor === '') {
      return 'No registrado';
    }

    return `${valor}${unidad ? ' ' + unidad : ''}`;
  }
}
