export interface Medico {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  especialidades: string[];
  estado: boolean;
}
