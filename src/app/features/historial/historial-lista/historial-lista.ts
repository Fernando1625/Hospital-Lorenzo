import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { HistorialService } from '../../../core/services/historial';

@Component({
  selector: 'app-historial-lista',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './historial-lista.html',
  styleUrl: './historial-lista.css',
})
export class HistorialLista {
  private pacientesService = inject(PacientesService);
  private historialService = inject(HistorialService);

  busqueda = '';

  pacientes = this.pacientesService.pacientes;
  atenciones = this.historialService.atenciones;

  // Buscar expedientes por nombre o cédula
  get pacientesFiltrados() {
    const texto = this.busqueda.toLowerCase().trim();

    return this.pacientes().filter((paciente) => {
      const nombreCompleto = `${paciente.nombres} ${paciente.apellidos}`.toLowerCase();

      return paciente.cedula.includes(texto) || nombreCompleto.includes(texto);
    });
  }

  // Total de pacientes con expediente
  get totalPacientes(): number {
    return this.pacientes().length;
  }

  // Total de atenciones médicas registradas
  get totalAtenciones(): number {
    return this.atenciones().length;
  }

  // Cantidad de atenciones de un paciente
  contarAtenciones(pacienteId: number): number {
    return this.atenciones().filter((atencion) => atencion.pacienteId === pacienteId).length;
  }
}
