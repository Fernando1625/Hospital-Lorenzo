import { Injectable, inject, signal } from '@angular/core';

import {
  Factura,
  DetalleFactura,
  NuevaFactura,
  NuevoPagoFactura,
  PagoFactura,
} from '../../shared/models/factura.model';

import { PacientesService } from './pacientes';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  // Consultar los pacientes ya registrados en el hospital
  private pacientesService = inject(PacientesService);

  /**
   * Facturas ficticias para las pruebas del frontend.
   *
   * Los nombres y cédulas son datos inventados,
   * independientes de los registros de Pacientes.
   *
   * No son documentos tributarios reales.
   */
  private facturasSignal = signal<Factura[]>([
    {
      id: 1,
      numero: 'F-0001',
      fechaEmision: '2026-10-19',
      pacienteId: 1,
      pacienteNombre: 'Ana Torres',
      pacienteCedula: 'CED-DEMO-001',
      descripcion: 'Consulta médica general',
      subtotal: 45,
      impuestos: 0,
      total: 45,
      estado: 'Pagada',
    },
    {
      id: 2,
      numero: 'F-0002',
      fechaEmision: '2026-10-20',
      pacienteId: 2,
      pacienteNombre: 'Carlos López',
      pacienteCedula: 'CED-DEMO-002',
      descripcion: 'Consulta especializada',
      subtotal: 80,
      impuestos: 0,
      total: 80,
      estado: 'Pendiente',
    },
    {
      id: 3,
      numero: 'F-0003',
      fechaEmision: '2026-10-21',
      pacienteId: 3,
      pacienteNombre: 'María Pérez',
      pacienteCedula: 'CED-DEMO-003',
      descripcion: 'Consulta de control',
      subtotal: 30,
      impuestos: 0,
      total: 30,
      estado: 'Pagada',
    },
    {
      id: 4,
      numero: 'F-0004',
      fechaEmision: '2026-10-22',
      pacienteId: 4,
      pacienteNombre: 'Luis Mendoza',
      pacienteCedula: 'CED-DEMO-004',
      descripcion: 'Consulta médica especializada',
      subtotal: 65,
      impuestos: 0,
      total: 65,
      estado: 'Pendiente',
    },
    {
      id: 5,
      numero: 'F-0005',
      fechaEmision: '2026-10-23',
      pacienteId: 1,
      pacienteNombre: 'Ana Torres',
      pacienteCedula: 'CED-DEMO-001',
      descripcion: 'Consulta de seguimiento',
      subtotal: 25,
      impuestos: 0,
      total: 25,
      estado: 'Pagada',
    },
  ]);

  // Exponer registros reactivos de solo lectura
  readonly facturas = this.facturasSignal.asReadonly();

  // Obtener una factura mediante su identificador
  obtenerFacturaPorId(id: number): Factura | undefined {
    return this.facturasSignal().find((factura) => factura.id === id);
  }

  // Buscar una factura mediante su número
  obtenerFacturaPorNumero(numero: string): Factura | undefined {
    return this.facturasSignal().find(
      (factura) => factura.numero.toLowerCase() === numero.trim().toLowerCase(),
    );
  }

  /**
   * Registrar un comprobante de demostración.
   *
   * Valida el paciente, los conceptos y sus importes.
   * El número generado no tiene validez tributaria.
   */
  registrarFactura(datos: NuevaFactura): boolean {
    // Comprobar que el paciente exista y esté activo
    const paciente = this.pacientesService.obtenerPacientePorId(datos.pacienteId);

    if (!paciente || !paciente.estado) {
      return false;
    }

    // Debe existir al menos un concepto
    if (!datos.detalles.length) {
      return false;
    }

    // Verificar los datos de cada concepto
    const detallesValidos = datos.detalles.every(
      (detalle) =>
        detalle.descripcion.trim().length > 0 &&
        Number.isInteger(detalle.cantidad) &&
        detalle.cantidad > 0 &&
        Number.isFinite(detalle.precioUnitario) &&
        detalle.precioUnitario > 0 &&
        Math.abs(detalle.precioUnitario * 100 - Math.round(detalle.precioUnitario * 100)) <
          0.000001 &&
        Number.isSafeInteger(detalle.precioUnitario * 100) &&
        Number.isSafeInteger(detalle.cantidad * Math.round(detalle.precioUnitario * 100)),
    );

    if (!detallesValidos) {
      return false;
    }

    // Construir los detalles y calcular sus subtotales
    const detallesFactura: DetalleFactura[] = datos.detalles.map((detalle, indice) => {
      const precioCentavos = Math.round(detalle.precioUnitario * 100);

      const subtotalCentavos = detalle.cantidad * precioCentavos;

      return {
        id: indice + 1,
        descripcion: detalle.descripcion.trim(),
        cantidad: detalle.cantidad,
        precioUnitario: precioCentavos / 100,
        subtotal: subtotalCentavos / 100,
      };
    });

    // Total de los conceptos, expresado en centavos
    const subtotalCentavos = detallesFactura.reduce(
      (suma, detalle) => suma + Math.round(detalle.subtotal * 100),
      0,
    );

    if (!Number.isSafeInteger(subtotalCentavos)) {
      return false;
    }

    const subtotal = subtotalCentavos / 100;

    // Impuestos pendientes de clasificación tributaria
    const impuestos = 0;
    const total = subtotal + impuestos;

    // Crear el identificador interno
    const facturasActuales = this.facturasSignal();

    const nuevoId = Math.max(0, ...facturasActuales.map((factura) => factura.id)) + 1;

    // Número interno del prototipo
    const numero = `F-${String(nuevoId).padStart(4, '0')}`;

    // Obtener fecha local, sin conversión UTC
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');

    const fechaEmision = `${anio}-${mes}-${dia}`;

    // Construir la factura
    const nuevaFactura: Factura = {
      id: nuevoId,
      numero,
      fechaEmision,

      pacienteId: paciente.id,
      pacienteNombre: `${paciente.nombres} ${paciente.apellidos}`,
      pacienteCedula: paciente.cedula,

      descripcion: detallesFactura.map((detalle) => detalle.descripcion).join(', '),

      subtotal,
      impuestos,
      total,

      estado: 'Pendiente',
      detalles: detallesFactura,
    };

    // Agregar la factura al Signal
    this.facturasSignal.update((facturas) => [...facturas, nuevaFactura]);

    return true;
  }

  /**
   * Registrar un pago completo de demostración.
   *
   * No ejecuta transferencias, cobros bancarios
   * ni operaciones tributarias reales.
   */
  registrarPago(datos: NuevoPagoFactura): boolean {
    const factura = this.obtenerFacturaPorId(datos.facturaId);

    // Solo se pueden pagar facturas pendientes
    if (!factura || factura.estado !== 'Pendiente') {
      return false;
    }

    // Evitar registrar un segundo pago
    if ((factura.pagos ?? []).length > 0) {
      return false;
    }

    // Validar la forma de pago
    const formasPermitidas = ['Efectivo', 'Transferencia', 'Tarjeta'];

    if (!formasPermitidas.includes(datos.formaPago)) {
      return false;
    }

    const referencia = datos.referencia.trim();

    // Transferencia y tarjeta necesitan referencia
    if (datos.formaPago !== 'Efectivo' && referencia.length === 0) {
      return false;
    }

    if (referencia.length > 80) {
      return false;
    }

    // Comprobar que el importe sea válido
    const montoCentavos = Math.round(factura.total * 100);

    if (!Number.isSafeInteger(montoCentavos) || montoCentavos <= 0) {
      return false;
    }

    // Generar el siguiente ID de pago
    const idsPagos = this.facturasSignal()
      .flatMap((f) => f.pagos ?? [])
      .map((pago) => pago.id);

    const nuevoId = Math.max(0, ...idsPagos) + 1;

    // Fecha y hora local del registro
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');

    const hora = String(ahora.getHours()).padStart(2, '0');
    const minuto = String(ahora.getMinutes()).padStart(2, '0');
    const segundo = String(ahora.getSeconds()).padStart(2, '0');

    const fechaPago = `${anio}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

    // Construir el pago ficticio
    const nuevoPago: PagoFactura = {
      id: nuevoId,
      facturaId: factura.id,
      fechaPago,
      formaPago: datos.formaPago,
      referencia: datos.formaPago === 'Efectivo' ? null : referencia,
      monto: montoCentavos / 100,
    };

    // Registrar el pago y actualizar la factura juntos
    this.facturasSignal.update((facturas) =>
      facturas.map((f) =>
        f.id === factura.id
          ? {
              ...f,
              estado: 'Pagada' as const,
              pagos: [...(f.pagos ?? []), nuevoPago],
            }
          : f,
      ),
    );

    return true;
  }
}
