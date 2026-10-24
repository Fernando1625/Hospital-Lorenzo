import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PacientesService } from '../../core/services/pacientes';

import { MedicosService } from '../../core/services/medicos';

import { CitasService } from '../../core/services/citas';

import { FacturasService } from '../../core/services/facturas';

import { SesionService } from '../../core/services/sesion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Servicios de los módulos del sistema
  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);
  private citasService = inject(CitasService);
  private facturasService = inject(FacturasService);
  private sesionService = inject(SesionService);

  // Información reactiva
  readonly pacientes = this.pacientesService.pacientes;
  readonly medicos = this.medicosService.medicos;
  readonly citas = this.citasService.citas;
  readonly facturas = this.facturasService.facturas;

  readonly usuarioActual = this.sesionService.usuarioActual;

  // =====================================
  // INDICADORES DE PACIENTES
  // =====================================

  readonly totalPacientes = computed(() => this.pacientes().length);

  readonly pacientesActivos = computed(() => this.pacientes().filter((p) => p.estado).length);

  // =====================================
  // INDICADORES DE MÉDICOS
  // =====================================

  readonly totalMedicos = computed(() => this.medicos().length);

  readonly medicosActivos = computed(() => this.medicos().filter((m) => m.estado).length);

  // =====================================
  // INDICADORES DE CITAS
  // =====================================

  readonly totalCitas = computed(() => this.citas().length);

  readonly citasProgramadas = computed(
    () => this.citas().filter((c) => c.estado === 'Programada').length,
  );

  readonly citasConfirmadas = computed(
    () => this.citas().filter((c) => c.estado === 'Confirmada').length,
  );

  readonly citasEnAtencion = computed(
    () => this.citas().filter((c) => c.estado === 'En atención').length,
  );

  readonly citasAtendidas = computed(
    () => this.citas().filter((c) => c.estado === 'Atendida').length,
  );

  readonly citasCanceladas = computed(
    () => this.citas().filter((c) => c.estado === 'Cancelada').length,
  );
  readonly citasNoAsistio = computed(
    () => this.citas().filter((c) => c.estado === 'No asistió').length,
  );

  // =====================================
  // INDICADORES DE FACTURACIÓN
  // =====================================

  readonly totalFacturas = computed(() => this.facturas().length);

  readonly facturasPagadas = computed(
    () => this.facturas().filter((f) => f.estado === 'Pagada').length,
  );

  readonly facturasPendientes = computed(
    () => this.facturas().filter((f) => f.estado === 'Pendiente').length,
  );

  readonly facturasAnuladas = computed(
    () => this.facturas().filter((f) => f.estado === 'Anulada').length,
  );

  readonly montoPagado = computed(() =>
    this.facturas()
      .filter((f) => f.estado === 'Pagada')
      .reduce((total, f) => total + f.total, 0),
  );

  readonly montoPendiente = computed(() =>
    this.facturas()
      .filter((f) => f.estado === 'Pendiente')
      .reduce((total, f) => total + f.total, 0),
  );
}
