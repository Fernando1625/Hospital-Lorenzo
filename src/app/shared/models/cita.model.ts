export type EstadoCita =
  'Programada' | 'Confirmada' | 'En atención' | 'Atendida' | 'Cancelada' | 'No asistió';

export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  especialidad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: EstadoCita;
}
