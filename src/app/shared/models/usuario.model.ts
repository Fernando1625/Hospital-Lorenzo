/**
 * Roles disponibles en el sistema hospitalario.
 */
export type RolUsuario =
  | 'Administrador'
  | 'Médico'
  | 'Recepción'
  | 'Facturación';

/**
 * Información básica de un usuario del sistema.
 *
 * Este modelo es para administrar cuentas
 * desde el frontend. No almacena contraseñas.
 */
export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  correo: string;
  rol: RolUsuario;
  estado: boolean;
}
