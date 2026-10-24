
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  FacturasService
} from '../../../core/services/facturas';

import {
  Factura,
  DetalleFactura
} from '../../../shared/models/factura.model';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './facturas-detalle.html',
  styleUrl: './facturas-detalle.css'
})
export class FacturaDetalle {

  // Servicios necesarios
  private route = inject(ActivatedRoute);
  private facturasService = inject(FacturasService);

  // Factura seleccionada
  factura: Factura | undefined;

  // Indicar si se encontró el comprobante
  facturaNoEncontrada = false;

  constructor() {

    // Obtener el identificador desde la URL
    const idParametro =
      this.route.snapshot.paramMap.get('id');

    const id = Number(idParametro);

    // Validar el identificador recibido
    if (
      idParametro === null ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.facturaNoEncontrada = true;
      return;
    }

    // Buscar la factura en el servicio
    this.factura =
      this.facturasService.obtenerFacturaPorId(id);

    if (!this.factura) {
      this.facturaNoEncontrada = true;
    }
  }

  // Obtener conceptos disponibles
  get detalles(): DetalleFactura[] {
    return this.factura?.detalles ?? [];
  }

  // Saber si existen conceptos detallados
  get tieneDetalles(): boolean {
    return this.detalles.length > 0;
  }

  // Mostrar fechas sin cambiar de zona horaria
  formatearFecha(fecha: string): string {

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
  }
}
