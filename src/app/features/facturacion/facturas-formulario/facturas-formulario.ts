import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';

import { FacturasService } from '../../../core/services/facturas';

// Estructura temporal para editar conceptos
interface ConceptoEditable {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

@Component({
  selector: 'app-factura-formulario',
  standalone: true,
  imports: [FormsModule, DecimalPipe, RouterLink],
  templateUrl: './facturas-formulario.html',
  styleUrl: './facturas-formulario.css',
})
export class FacturaFormulario {
  private pacientesService = inject(PacientesService);
  private facturasService = inject(FacturasService);
  private router = inject(Router);

  // Pacientes registrados en el sistema
  readonly pacientes = this.pacientesService.pacientes;

  // Paciente seleccionado
  pacienteId: number | null = null;

  // Conceptos de la factura
  conceptos: ConceptoEditable[] = [
    {
      id: 1,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
    },
  ];

  private siguienteId = 2;

  // Mensajes de validación
  mensajeError = '';

  // Seleccionar únicamente pacientes activos
  get pacientesActivos() {
    return this.pacientes().filter((paciente) => paciente.estado);
  }

  // Consultar la información del paciente elegido
  get pacienteSeleccionado() {
    if (this.pacienteId === null) {
      return undefined;
    }

    return this.pacientesService.obtenerPacientePorId(this.pacienteId);
  }

  // Agregar un concepto nuevo
  agregarConcepto(): void {
    this.conceptos.push({
      id: this.siguienteId++,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
    });
  }

  // Quitar un concepto
  eliminarConcepto(id: number): void {
    // Mantener al menos una fila de conceptos
    if (this.conceptos.length <= 1) {
      return;
    }

    this.conceptos = this.conceptos.filter((concepto) => concepto.id !== id);
  }

  // Subtotal de un concepto
  calcularSubtotal(concepto: ConceptoEditable): number {
    if (
      !Number.isFinite(concepto.cantidad) ||
      !Number.isFinite(concepto.precioUnitario) ||
      concepto.cantidad <= 0 ||
      concepto.precioUnitario <= 0
    ) {
      return 0;
    }

    return Math.round(concepto.cantidad * concepto.precioUnitario * 100) / 100;
  }

  // Suma provisional de conceptos, sin impuestos
  get subtotalGeneral(): number {
    const centavos = this.conceptos.reduce(
      (total, concepto) => total + Math.round(this.calcularSubtotal(concepto) * 100),
      0,
    );

    return centavos / 100;
  }

  // Total referencial
  get totalGeneral(): number {
    return this.subtotalGeneral;
  }

  // Registrar factura
  guardarFactura(): void {
    this.mensajeError = '';

    // Verificar que se haya elegido un paciente
    if (
      this.pacienteId === null ||
      !this.pacienteSeleccionado ||
      !this.pacienteSeleccionado.estado
    ) {
      this.mensajeError = 'Seleccione un paciente activo.';
      return;
    }

    // Validar los conceptos antes de registrar
    const conceptosValidos = this.conceptos.every(
      (concepto) =>
        concepto.descripcion.trim().length > 0 &&
        Number.isInteger(concepto.cantidad) &&
        concepto.cantidad > 0 &&
        Number.isFinite(concepto.precioUnitario) &&
        concepto.precioUnitario > 0 &&
        Number.isSafeInteger(Math.round(concepto.precioUnitario * 100)) &&
        Math.abs(concepto.precioUnitario * 100 - Math.round(concepto.precioUnitario * 100)) <
          0.000001,
    );

    if (!conceptosValidos) {
      this.mensajeError =
        'Complete todos los conceptos. La cantidad debe ' +
        'ser un entero positivo y el precio debe tener ' +
        'como máximo dos decimales.';
      return;
    }

    // Registrar utilizando el servicio
    const registrado = this.facturasService.registrarFactura({
      pacienteId: this.pacienteId,

      detalles: this.conceptos.map((concepto) => ({
        descripcion: concepto.descripcion.trim(),
        cantidad: concepto.cantidad,
        precioUnitario: concepto.precioUnitario,
      })),
    });

    if (!registrado) {
      this.mensajeError = 'No se pudo registrar el comprobante. ' + 'Revise los datos ingresados.';
      return;
    }

    // Regresar al listado de facturas
    this.router.navigate(['/facturacion']);
  }
}
