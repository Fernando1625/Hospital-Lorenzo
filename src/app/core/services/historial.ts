
import { Injectable, signal } from '@angular/core';

import { AtencionMedica } from '../../shared/models/historial.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  // Datos ficticios para desarrollar y probar la interfaz
  private atencionesSignal = signal<AtencionMedica[]>([
    {
      id: 1,
      pacienteId: 1,
      medicoId: 1,
      citaId: null,
      fechaAtencion: '2026-09-15',
      sintomas: 'Dolor de cabeza ocasional',
      diagnostico: 'Cefalea tensional',
      tratamiento: 'Indicaciones generales registradas para la prueba',
      observaciones: 'Información completamente ficticia',
      temperatura: 36.5,
      presionArterial: '120/80',
      frecuenciaCardiaca: 75,
      peso: 68,
      estatura: 1.70
    },
    {
      id: 2,
      pacienteId: 1,
      medicoId: 1,
      citaId: null,
      fechaAtencion: '2026-10-08',
      sintomas: 'Consulta de seguimiento',
      diagnostico: 'Evaluación de seguimiento',
      tratamiento: 'Continuar seguimiento según criterio médico',
      observaciones: 'Registro de ejemplo sin validez clínica',
      temperatura: 36.7,
      presionArterial: '118/78',
      frecuenciaCardiaca: 72,
      peso: 68,
      estatura: 1.70
    }
  ]);

  // Permitir consultar la información sin modificarla directamente
  atenciones = this.atencionesSignal.asReadonly();

  // Obtener las atenciones de un paciente
  obtenerPorPaciente(pacienteId: number): AtencionMedica[] {
    return this.atencionesSignal()
      .filter(atencion => atencion.pacienteId === pacienteId)
      .sort((a, b) =>
        b.fechaAtencion.localeCompare(a.fechaAtencion)
      );
  }

  // Consultar una atención específica
  obtenerAtencionPorId(id: number): AtencionMedica | undefined {
    return this.atencionesSignal().find(
      atencion => atencion.id === id
    );
  }

  // Contar las atenciones de un paciente
  contarAtenciones(pacienteId: number): number {
    return this.atencionesSignal().filter(
      atencion => atencion.pacienteId === pacienteId
    ).length;
  }
}
