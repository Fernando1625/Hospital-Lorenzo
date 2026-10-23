/**
 * Representa una atención médica realizada
 * a un paciente del hospital.
 */
export interface AtencionMedica {
  id: number;

  // Relaciones con otros módulos
  pacienteId: number;
  medicoId: number;
  citaId: number | null;

  // Información clínica
  fechaAtencion: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;

  // Signos vitales opcionales
  temperatura: number | null;
  presionArterial: string | null;
  frecuenciaCardiaca: number | null;
  peso: number | null;
  estatura: number | null;
}
