import { Injectable, inject, signal } from '@angular/core';
import { AtencionMedica } from '../../shared/models/historial.model';
import { CitasService } from './citas';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private citasService = inject(CitasService);

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
      estatura: 1.7,
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
      estatura: 1.7,
    },
  ]);

  // Permitir consultar la información sin modificarla directamente
  atenciones = this.atencionesSignal.asReadonly();

  // Obtener las atenciones de un paciente
  obtenerPorPaciente(pacienteId: number): AtencionMedica[] {
    return this.atencionesSignal()
      .filter((atencion) => atencion.pacienteId === pacienteId)
      .sort((a, b) => b.fechaAtencion.localeCompare(a.fechaAtencion));
  }

  // Consultar una atención específica
  obtenerAtencionPorId(id: number): AtencionMedica | undefined {
    return this.atencionesSignal().find((atencion) => atencion.id === id);
  }

  // Contar las atenciones de un paciente
  contarAtenciones(pacienteId: number): number {
    return this.atencionesSignal().filter((atencion) => atencion.pacienteId === pacienteId).length;
  }

  /**
   * Registra una atención médica vinculada a una cita.
   * Versión académica: datos almacenados en memoria.
   */
  registrarAtencion(datos: Omit<AtencionMedica, 'id'>): boolean {
    const cita =
      datos.citaId !== null ? this.citasService.obtenerCitaPorId(datos.citaId) : undefined;

    // La atención debe corresponder a una cita en curso.
    if (
      !cita ||
      cita.estado !== 'En atención' ||
      cita.pacienteId !== datos.pacienteId ||
      cita.medicoId !== datos.medicoId
    ) {
      return false;
    }

    // Comprobar que la cita no tenga una atención registrada.
    const existeRegistro = this.atencionesSignal().some(
      (atencion) => atencion.citaId === datos.citaId,
    );

    if (existeRegistro) {
      return false;
    }

    // Validación de información clínica obligatoria.
    if (!datos.sintomas.trim() || !datos.diagnostico.trim() || !datos.tratamiento.trim()) {
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaAtencion)) {
      return false;
    }

    // Verificar valores opcionales.
    if (
      (datos.temperatura !== null && (datos.temperatura < 25 || datos.temperatura > 45)) ||
      (datos.frecuenciaCardiaca !== null &&
        (datos.frecuenciaCardiaca < 20 || datos.frecuenciaCardiaca > 250)) ||
      (datos.peso !== null && (datos.peso <= 0 || datos.peso > 500)) ||
      (datos.estatura !== null && (datos.estatura <= 0 || datos.estatura > 3))
    ) {
      return false;
    }

    if (datos.presionArterial !== null && !/^\d{2,3}\/\d{2,3}$/.test(datos.presionArterial)) {
      return false;
    }

    const registrosActuales = this.atencionesSignal();

    const nuevoId = Math.max(0, ...registrosActuales.map((atencion) => atencion.id)) + 1;

    this.atencionesSignal.update((atenciones) => [
      ...atenciones,
      {
        ...datos,
        id: nuevoId,
        sintomas: datos.sintomas.trim(),
        diagnostico: datos.diagnostico.trim(),
        tratamiento: datos.tratamiento.trim(),
        observaciones: datos.observaciones.trim(),
      },
    ]);

    return true;
  }

  // Comprobar si una cita tiene un registro clínico
  tieneAtencionRegistrada(citaId: number): boolean {
    return this.atencionesSignal().some((atencion) => atencion.citaId === citaId);
  }

  // Finalizar una cita con atención clínica registrada
  finalizarAtencion(citaId: number): boolean {
    const cita = this.citasService.obtenerCitaPorId(citaId);

    // Debe existir y encontrarse en atención
    if (!cita || cita.estado !== 'En atención') {
      return false;
    }

    // Debe contar con información clínica registrada
    if (!this.tieneAtencionRegistrada(citaId)) {
      return false;
    }

    // Aplicar las reglas de estado de las citas
    return this.citasService.cambiarEstadoCita(citaId, 'Atendida');
  }
}
