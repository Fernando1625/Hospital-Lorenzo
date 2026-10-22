import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MedicosService } from '../../../core/services/medicos';
import { Medico } from '../../../shared/models/medico.model';

@Component({
  selector: 'app-medico-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medico-detalle.html',
  styleUrl: './medico-detalle.css',
})
export class MedicoDetalle {
  private route = inject(ActivatedRoute);
  private medicosService = inject(MedicosService);

  medico?: Medico;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(id) && id > 0) {
      this.medico = this.medicosService.obtenerMedicoPorId(id);
    }
  }
}
