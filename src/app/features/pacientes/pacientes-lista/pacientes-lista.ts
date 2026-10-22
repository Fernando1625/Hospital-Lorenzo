
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { Paciente } from '../../../shared/models/paciente.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-pacientes-lista',
  standalone: true,
  imports: [FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './pacientes-lista.html',
  styleUrl: './pacientes-lista.css'
})
export class PacientesLista {

  private pacientesService = inject(PacientesService);

  busqueda = '';

  pacientes = this.pacientesService.pacientes;

  // Paciente seleccionado para cambiar su estado
  pacienteSeleccionado: Paciente | null = null;

  mensajeOperacion = '';

  get pacientesFiltrados(): Paciente[] {

    const texto = this.busqueda.toLowerCase().trim();

    return this.pacientes().filter(paciente =>
      paciente.cedula.includes(texto) ||
      paciente.nombres.toLowerCase().includes(texto) ||
      paciente.apellidos.toLowerCase().includes(texto)
    );
  }

  // Mostrar el cuadro de confirmación
  solicitarCambioEstado(paciente: Paciente): void {
    this.mensajeOperacion = '';
    this.pacienteSeleccionado = paciente;
  }

  // Ejecutar la acción confirmada
  confirmarCambioEstado(): void {

    if (!this.pacienteSeleccionado) {
      return;
    }

    const paciente = this.pacienteSeleccionado;

    const resultado = this.pacientesService
      .cambiarEstadoPaciente(paciente.id);

    if (resultado) {
      this.mensajeOperacion =
        `El paciente ${paciente.nombres} ${paciente.apellidos} ` +
        `fue ${paciente.estado ? 'desactivado' : 'activado'} correctamente.`;
    } else {
      this.mensajeOperacion =
        'No se pudo actualizar el estado del paciente.';
    }

    this.pacienteSeleccionado = null;
  }

  // Cancelar sin modificar información
  cancelarCambioEstado(): void {
    this.pacienteSeleccionado = null;
  }
}
