
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MedicosService } from '../../../core/services/medicos';
import { Medico } from '../../../shared/models/medico.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-medicos-lista',
  standalone: true,
  imports: [FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './medico-lista.html',
  styleUrl: './medico-lista.css'
})
export class MedicosLista {

  private medicosService = inject(MedicosService);

  busqueda = '';
  filtroEstado = 'todos';

  medicos = this.medicosService.medicos;

  medicoSeleccionado: Medico | null = null;
  mensajeOperacion = '';

  get medicosFiltrados(): Medico[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.medicos().filter(medico => {

      const coincideTexto =
        medico.cedula.includes(texto) ||
        medico.nombres.toLowerCase().includes(texto) ||
        medico.apellidos.toLowerCase().includes(texto) ||
        medico.especialidades.some(e =>
          e.toLowerCase().includes(texto)
        );

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && medico.estado) ||
        (this.filtroEstado === 'inactivos' && !medico.estado);

      return coincideTexto && coincideEstado;
    });
  }

  get totalMedicos(): number {
    return this.medicos().length;
  }

  get medicosActivos(): number {
    return this.medicos().filter(m => m.estado).length;
  }

  get medicosInactivos(): number {
    return this.medicos().filter(m => !m.estado).length;
  }

  solicitarCambioEstado(medico: Medico): void {
    this.mensajeOperacion = '';
    this.medicoSeleccionado = medico;
  }

  confirmarCambioEstado(): void {
    if (!this.medicoSeleccionado) {
      return;
    }

    const medico = this.medicoSeleccionado;

    const actualizado =
      this.medicosService.cambiarEstadoMedico(medico.id);

    if (actualizado) {
      this.mensajeOperacion =
        `El médico ${medico.nombres} ${medico.apellidos} fue ` +
        `${medico.estado ? 'desactivado' : 'activado'} correctamente.`;
    } else {
      this.mensajeOperacion =
        'No se pudo actualizar el estado del médico.';
    }

    this.medicoSeleccionado = null;
  }

  cancelarCambioEstado(): void {
    this.medicoSeleccionado = null;
  }
}
