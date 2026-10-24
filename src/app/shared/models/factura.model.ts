/**
 * Estados referenciales del comprobante.
 */
export type EstadoFactura = 'Pendiente' | 'Pagada' | 'Anulada';

// Formas de pago admitidas por el prototipo
export type FormaPago = 'Efectivo' | 'Transferencia' | 'Tarjeta';

// Registro de un pago ficticio asociado a una factura
export interface PagoFactura {
  id: number;
  facturaId: number;
  fechaPago: string;
  formaPago: FormaPago;
  referencia: string | null;
  monto: number;
}

// Datos que recibe el servicio para registrar un pago
export interface NuevoPagoFactura {
  facturaId: number;
  formaPago: FormaPago;
  referencia: string;
}

/**
 * Concepto registrado dentro de una factura.
 */
export interface DetalleFactura {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/**
 * Factura de demostración del sistema hospitalario.
 *
 * No representa una factura electrónica autorizada.
 */
export interface Factura {
  id: number;
  numero: string;
  fechaEmision: string;

  pacienteId: number;
  pacienteNombre: string;
  pacienteCedula: string;
  // Atención clínica vinculada, si corresponde
  atencionId?: number | null;

  descripcion: string;
  subtotal: number;
  impuestos: number;
  total: number;

  estado: EstadoFactura;

  // Conceptos y pagos del comprobante
  detalles?: DetalleFactura[];
  pagos?: PagoFactura[];

  // Información de anulación del comprobante
  motivoAnulacion?: string;
  fechaAnulacion?: string;
}

/**
 * Datos de entrada para registrar una factura.
 *
 * Los importes se calcularán en el servicio.
 */
export interface NuevaFactura {
  pacienteId: number;

  detalles: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}
