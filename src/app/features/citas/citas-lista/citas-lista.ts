import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CitasService } from '../../../core/services/citas';
import { PacientesService } from '../../../core/services/pacientes';
import { MedicosService } from '../../../core/services/medicos';

import { Cita, EstadoCita } from '../../../shared/models/cita.model';
import { RouterLink } from '@angular/router';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-citas-lista',
  standalone: true,
  imports: [FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './citas-lista.html',
  styleUrl: './citas-lista.css',
})
export class CitasLista {
  private citasService = inject(CitasService);
  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);

  busqueda = '';
  filtroEstado = 'todos';
  filtroFecha = '';

  citas = this.citasService.citas;

  citaSeleccionada: Cita | null = null;
  mensajeOperacion = '';

  puedeModificar(cita: Cita): boolean {
    return ['Programada', 'Confirmada'].includes(cita.estado);
  }

  solicitarCancelacion(cita: Cita): void {
    if (!this.puedeModificar(cita)) {
      return;
    }

    this.mensajeOperacion = '';
    this.citaSeleccionada = cita;
  }

  confirmarCancelacion(): void {
    if (!this.citaSeleccionada) {
      return;
    }

    const resultado = this.citasService.cancelarCita(this.citaSeleccionada.id);

    this.mensajeOperacion = resultado
      ? 'La cita médica fue cancelada correctamente.'
      : 'No se pudo cancelar la cita médica.';

    this.citaSeleccionada = null;
  }

  cancelarOperacion(): void {
    this.citaSeleccionada = null;
  }

  // Consultar el nombre de un paciente
  nombrePaciente(id: number): string {
    const paciente = this.pacientesService.obtenerPacientePorId(id);

    if (!paciente) {
      return 'Paciente no encontrado';
    }

    return `${paciente.nombres} ${paciente.apellidos}`;
  }

  // Consultar el nombre de un médico
  nombreMedico(id: number): string {
    const medico = this.medicosService.obtenerMedicoPorId(id);

    if (!medico) {
      return 'Médico no encontrado';
    }

    return `${medico.nombres} ${medico.apellidos}`;
  }

  // Obtener citas según búsqueda y filtros
  get citasFiltradas(): Cita[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.citas()
      .filter((cita) => {
        const nombrePaciente = this.nombrePaciente(cita.pacienteId).toLowerCase();

        const nombreMedico = this.nombreMedico(cita.medicoId).toLowerCase();

        const coincideBusqueda =
          nombrePaciente.includes(texto) ||
          nombreMedico.includes(texto) ||
          cita.especialidad.toLowerCase().includes(texto);

        const coincideEstado = this.filtroEstado === 'todos' || cita.estado === this.filtroEstado;

        const coincideFecha = !this.filtroFecha || cita.fecha === this.filtroFecha;

        return coincideBusqueda && coincideEstado && coincideFecha;
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio));
  }

  get totalCitas(): number {
    return this.citas().length;
  }

  contarPorEstado(estado: EstadoCita): number {
    return this.citas().filter((cita) => cita.estado === estado).length;
  }
}
