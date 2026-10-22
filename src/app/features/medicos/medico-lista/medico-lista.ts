
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MedicosService } from '../../../core/services/medicos';
import { Medico } from '../../../shared/models/medico.model';

@Component({
  selector: 'app-medicos-lista',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './medico-lista.html',
  styleUrl: './medico-lista.css'
})
export class MedicosLista {

  private medicosService = inject(MedicosService);

  busqueda = '';
  filtroEstado = 'todos';

  medicos = this.medicosService.medicos;

  // Obtener médicos según los filtros
  get medicosFiltrados(): Medico[] {

    const texto = this.busqueda.toLowerCase().trim();

    return this.medicos().filter(medico => {

      const coincideTexto =
        medico.cedula.includes(texto) ||
        medico.nombres.toLowerCase().includes(texto) ||
        medico.apellidos.toLowerCase().includes(texto) ||
        medico.especialidades.some(esp =>
          esp.toLowerCase().includes(texto)
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
}
