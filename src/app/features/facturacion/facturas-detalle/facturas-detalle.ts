
import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  FacturasService
} from '../../../core/services/facturas';

import {
  DetalleFactura,
  FormaPago,
  PagoFactura
} from '../../../shared/models/factura.model';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './facturas-detalle.html',
  styleUrl: './facturas-detalle.css'
})
export class FacturaDetalle {

  private route = inject(ActivatedRoute);
  private facturasService = inject(FacturasService);

  // Identificador de la factura recibido en la URL
  private readonly facturaId = Number(
    this.route.snapshot.paramMap.get('id')
  );

  // Consultar la factura directamente del Signal
  readonly factura = computed(() => {

    if (
      !Number.isInteger(this.facturaId) ||
      this.facturaId <= 0
    ) {
      return undefined;
    }

    // Leer el Signal para detectar sus actualizaciones
    const facturas = this.facturasService.facturas();

    return facturas.find(
      factura => factura.id === this.facturaId
    );
  });

  // Valores para registrar el pago
  formaPago: FormaPago = 'Efectivo';
  referencia = '';

  // Mensajes de resultado
  mensajeOperacion = '';
  errorOperacion = '';

  // Consultar los detalles del comprobante
  get detalles(): DetalleFactura[] {
    return this.factura()?.detalles ?? [];
  }

  // Comprobar si tiene conceptos individuales
  get tieneDetalles(): boolean {
    return this.detalles.length > 0;
  }

  // Historial de pagos disponibles
  get pagos(): PagoFactura[] {
    return this.factura()?.pagos ?? [];
  }

  // Determinar si se puede registrar un pago
  get puedeRegistrarPago(): boolean {
    const factura = this.factura();

    return !!factura &&
      factura.estado === 'Pendiente' &&
      (factura.pagos ?? []).length === 0 &&
      Number.isFinite(factura.total) &&
      factura.total > 0;
  }

  // Registrar el pago completo de demostración
  registrarPago(): void {

    this.mensajeOperacion = '';
    this.errorOperacion = '';

    const factura = this.factura();

    if (!factura || !this.puedeRegistrarPago) {
      this.errorOperacion =
        'La factura no está disponible para registrar pagos.';
      return;
    }

    if (
      this.formaPago !== 'Efectivo' &&
      !this.referencia.trim()
    ) {
      this.errorOperacion =
        'Ingrese la referencia de la operación.';
      return;
    }

    const resultado = this.facturasService.registrarPago({
      facturaId: factura.id,
      formaPago: this.formaPago,
      referencia: this.referencia
    });

    if (!resultado) {
      this.errorOperacion =
        'No fue posible registrar el pago. Revise los datos.';
      return;
    }

    // Limpiar los controles después de guardar
    this.formaPago = 'Efectivo';
    this.referencia = '';

    this.mensajeOperacion =
      'Pago de demostración registrado correctamente.';
  }

  // Formatear fecha del comprobante
  formatearFecha(fecha: string): string {

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] = partes;

    return `${dia}/${mes}/${anio}`;
  }

  // Formatear fecha y hora del pago
  formatearFechaHora(fecha: string): string {

    const [fechaParte, horaParte] = fecha.split(' ');

    return `${this.formatearFecha(fechaParte)} ${horaParte ?? ''}`;
  }
}
