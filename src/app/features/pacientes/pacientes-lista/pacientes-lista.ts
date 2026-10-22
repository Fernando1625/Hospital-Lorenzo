
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { Paciente } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-pacientes-lista',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pacientes-lista.html',
  styleUrl: './pacientes-lista.css'
})
export class PacientesLista {

  private pacientesService = inject(PacientesService);

  busqueda = '';

  pacientes = this.pacientesService.pacientes;

  get pacientesFiltrados(): Paciente[] {

    const texto = this.busqueda.toLowerCase().trim();

    return this.pacientes().filter(paciente =>
      paciente.cedula.includes(texto) ||
      paciente.nombres.toLowerCase().includes(texto) ||
      paciente.apellidos.toLowerCase().includes(texto)
    );
  }
}
