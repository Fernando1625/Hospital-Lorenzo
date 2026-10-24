
/**
 * Estados referenciales del comprobante.
 */
export type EstadoFactura =
  | 'Pendiente'
  | 'Pagada'
  | 'Anulada';

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

  descripcion: string;
  subtotal: number;
  impuestos: number;
  total: number;

  estado: EstadoFactura;

  // Detalles asociados al comprobante
  detalles?: DetalleFactura[];
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
