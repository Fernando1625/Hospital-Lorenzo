import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

import { FacturasService } from '../../../core/services/facturas';

import { DetalleFactura, FormaPago, PagoFactura } from '../../../shared/models/factura.model';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './facturas-detalle.html',
  styleUrl: './facturas-detalle.css',
})
export class FacturaDetalle {
  private route = inject(ActivatedRoute);
  private facturasService = inject(FacturasService);

  // Identificador de la factura recibido en la URL
  private readonly facturaId = Number(this.route.snapshot.paramMap.get('id'));

  // Consultar la factura directamente del Signal
  readonly factura = computed(() => {
    if (!Number.isInteger(this.facturaId) || this.facturaId <= 0) {
      return undefined;
    }

    // Leer el Signal para detectar sus actualizaciones
    const facturas = this.facturasService.facturas();

    return facturas.find((factura) => factura.id === this.facturaId);
  });

  // Valores para registrar el pago
  formaPago: FormaPago = 'Efectivo';
  referencia = '';

  // Mensajes de resultado
  mensajeOperacion = '';
  errorOperacion = '';

  // Motivo escrito por el usuario
  motivoAnulacion = '';

  // Control del diálogo de confirmación
  mostrarConfirmacionAnulacion = false;

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

    return (
      !!factura &&
      factura.estado === 'Pendiente' &&
      (factura.pagos ?? []).length === 0 &&
      Number.isFinite(factura.total) &&
      factura.total > 0
    );
  }

  // Registrar el pago completo de demostración
  registrarPago(): void {
    this.mensajeOperacion = '';
    this.errorOperacion = '';

    const factura = this.factura();

    if (!factura || !this.puedeRegistrarPago) {
      this.errorOperacion = 'La factura no está disponible para registrar pagos.';
      return;
    }

    if (this.formaPago !== 'Efectivo' && !this.referencia.trim()) {
      this.errorOperacion = 'Ingrese la referencia de la operación.';
      return;
    }

    const resultado = this.facturasService.registrarPago({
      facturaId: factura.id,
      formaPago: this.formaPago,
      referencia: this.referencia,
    });

    if (!resultado) {
      this.errorOperacion = 'No fue posible registrar el pago. Revise los datos.';
      return;
    }

    // Limpiar los controles después de guardar
    this.formaPago = 'Efectivo';
    this.referencia = '';

    this.mensajeOperacion = 'Pago de demostración registrado correctamente.';
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

  // Comprobar si es posible anular el comprobante
  get puedeAnularFactura(): boolean {
    const factura = this.factura();

    return !!factura && factura.estado === 'Pendiente' && (factura.pagos ?? []).length === 0;
  }

  // Abrir el cuadro de confirmación
  solicitarAnulacion(): void {
    console.log('Se presionó Solicitar anulación');

    this.mensajeOperacion = '';
    this.errorOperacion = '';

    if (!this.puedeAnularFactura) {
      this.errorOperacion = 'Esta factura no puede anularse.';
      return;
    }

    const motivo = this.motivoAnulacion.trim();

    if (motivo.length < 10 || motivo.length > 300) {
      this.errorOperacion = 'El motivo debe contener entre 10 y 300 caracteres.';
      return;
    }

    // Abrir la ventana de confirmación
    this.mostrarConfirmacionAnulacion = true;

    console.log('Mostrar confirmación:', this.mostrarConfirmacionAnulacion);
  }

  // Confirmar la anulación
  confirmarAnulacion(): void {
    this.mostrarConfirmacionAnulacion = false;
    this.mensajeOperacion = '';
    this.errorOperacion = '';

    const factura = this.factura();

    if (!factura || !this.puedeAnularFactura) {
      this.errorOperacion = 'El comprobante ya no está disponible para anulación.';
      return;
    }

    // El servicio vuelve a validar las reglas
    const resultado = this.facturasService.anularFactura(factura.id, this.motivoAnulacion);

    if (!resultado) {
      this.errorOperacion = 'No fue posible anular la factura.';
      return;
    }

    // Limpiar el formulario
    this.motivoAnulacion = '';

    this.mensajeOperacion = 'El comprobante fue anulado correctamente.';
  }

  // Cancelar sin modificar la factura
  cancelarAnulacion(): void {
    this.mostrarConfirmacionAnulacion = false;
  }
}
