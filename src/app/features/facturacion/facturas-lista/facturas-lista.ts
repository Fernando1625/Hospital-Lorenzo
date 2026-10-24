
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  FacturasService
} from '../../../core/services/facturas';

import {
  Factura,
  EstadoFactura
} from '../../../shared/models/factura.model';

@Component({
  selector: 'app-facturas-lista',
  standalone: true,
  imports: [FormsModule, DecimalPipe, RouterLink],
  templateUrl: './facturas-lista.html',
  styleUrl: './facturas-lista.css'
})
export class FacturasLista {

  // Servicio de facturación
  private facturasService = inject(FacturasService);

  // Datos reactivos del servicio
  readonly facturas = this.facturasService.facturas;

  // Valores de búsqueda y filtrado
  busqueda = '';
  filtroEstado = 'todos';

  // Estados definidos en el modelo
  readonly estados: EstadoFactura[] = [
    'Pendiente',
    'Pagada',
    'Anulada'
  ];

  // Listado filtrado por búsqueda y estado
  get facturasFiltradas(): Factura[] {

    const texto = this.busqueda.trim().toLowerCase();

    return this.facturas().filter(factura => {

      const coincideBusqueda =
        factura.numero.toLowerCase().includes(texto) ||
        factura.pacienteNombre.toLowerCase().includes(texto) ||
        factura.pacienteCedula.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        factura.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  // Total de documentos del prototipo
  get totalFacturas(): number {
    return this.facturas().length;
  }

  // Cantidad de facturas pagadas
  get totalPagadas(): number {
    return this.facturas().filter(
      factura => factura.estado === 'Pagada'
    ).length;
  }

  // Cantidad de facturas pendientes
  get totalPendientes(): number {
    return this.facturas().filter(
      factura => factura.estado === 'Pendiente'
    ).length;
  }

  // Importe de facturas pagadas
  get montoPagado(): number {
    return this.facturas()
      .filter(factura => factura.estado === 'Pagada')
      .reduce((suma, factura) => suma + factura.total, 0);
  }

  // Importe pendiente de cobro
  get montoPendiente(): number {
    return this.facturas()
      .filter(factura => factura.estado === 'Pendiente')
      .reduce((suma, factura) => suma + factura.total, 0);
  }

  // Mostrar una fecha YYYY-MM-DD en formato DD/MM/YYYY
  formatearFecha(fecha: string): string {

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
  }
}
