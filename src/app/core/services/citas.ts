import { Injectable, signal } from '@angular/core';
import { Cita } from '../../shared/models/cita.model';
import { inject } from '@angular/core';
import { PacientesService } from './pacientes';
import { MedicosService } from './medicos';
import { HorariosService } from './horarios';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  // Citas ficticias para probar el frontend
  private citasSignal = signal<Cita[]>([
    {
      id: 1,
      pacienteId: 1,
      medicoId: 1,
      especialidad: 'Cardiología',
      fecha: '2026-10-26',
      horaInicio: '09:00',
      horaFin: '09:30',
      motivo: 'Consulta de control',
      estado: 'Confirmada',
    },
    {
      id: 2,
      pacienteId: 2,
      medicoId: 1,
      especialidad: 'Cardiología',
      fecha: '2026-10-28',
      horaInicio: '14:00',
      horaFin: '14:30',
      motivo: 'Primera consulta',
      estado: 'Programada',
    },
    {
      id: 3,
      pacienteId: 2,
      medicoId: 1,
      especialidad: 'Cardiología',
      fecha: '2026-11-02',
      horaInicio: '10:00',
      horaFin: '10:30',
      motivo: 'Consulta de seguimiento',
      estado: 'Cancelada',
    },
  ]);

  // Consulta reactiva de las citas
  citas = this.citasSignal.asReadonly();

  // Buscar cita por identificador
  obtenerCitaPorId(id: number): Cita | undefined {
    return this.citasSignal().find((cita) => cita.id === id);
  }

  // Comprobar conflictos de horario
  existeConflicto(
    medicoId: number,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    citaExcluirId?: number,
  ): boolean {
    return this.citasSignal().some(
      (cita) =>
        cita.medicoId === medicoId &&
        cita.fecha === fecha &&
        cita.id !== citaExcluirId &&
        !['Cancelada', 'No asistió'].includes(cita.estado) &&
        horaInicio < cita.horaFin &&
        horaFin > cita.horaInicio,
    );
  }

  // Registrar una nueva cita

  registrarCita(datos: Omit<Cita, 'id'>): boolean {
    const paciente = this.pacientesService.obtenerPacientePorId(datos.pacienteId);

    const medico = this.medicosService.obtenerMedicoPorId(datos.medicoId);

    // Verificar paciente y médico activos
    if (!paciente?.estado || !medico?.estado) {
      return false;
    }

    // Verificar especialidad
    if (!medico.especialidades.includes(datos.especialidad)) {
      return false;
    }

    // Validar fecha
    if (!this.fechaValida(datos.fecha)) {
      return false;
    }

    // Verificar fecha futura o actual
    const hoy = new Date();
    const fechaActual =
      `${hoy.getFullYear()}-` +
      `${String(hoy.getMonth() + 1).padStart(2, '0')}-` +
      `${String(hoy.getDate()).padStart(2, '0')}`;

    if (datos.fecha < fechaActual) {
      return false;
    }

    // Comprobar formato y duración
    const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      !formatoHora.test(datos.horaInicio) ||
      !formatoHora.test(datos.horaFin) ||
      datos.horaFin !== this.calcularHoraFin(datos.horaInicio) ||
      datos.horaFin > '23:59'
    ) {
      return false;
    }

    // No registrar horas pasadas del día actual
    const horaActual =
      `${String(hoy.getHours()).padStart(2, '0')}:` +
      `${String(hoy.getMinutes()).padStart(2, '0')}`;

    if (datos.fecha === fechaActual && datos.horaInicio <= horaActual) {
      return false;
    }

    // Verificar jornada del médico
    if (!this.estaDentroHorario(datos.medicoId, datos.fecha, datos.horaInicio, datos.horaFin)) {
      return false;
    }

    // Verificar conflictos del médico
    if (this.existeConflicto(datos.medicoId, datos.fecha, datos.horaInicio, datos.horaFin)) {
      return false;
    }

    // Verificar conflictos del paciente
    if (
      this.pacienteTieneConflicto(datos.pacienteId, datos.fecha, datos.horaInicio, datos.horaFin)
    ) {
      return false;
    }

    const citasActuales = this.citasSignal();

    const nuevoId = Math.max(0, ...citasActuales.map((cita) => cita.id)) + 1;

    this.citasSignal.update((citas) => [...citas, { ...datos, id: nuevoId }]);

    return true;
  }

  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);
  private horariosService = inject(HorariosService);

  // Obtener el día de la semana (lunes = 1)
  obtenerDiaSemana(fecha: string): number {
    const partes = fecha.split('-').map(Number);

    const dia = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2])).getUTCDay();

    return dia === 0 ? 7 : dia;
  }

  // Comprobar que la fecha sea válida
  fechaValida(fecha: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return false;
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia));

    return (
      fechaUTC.getUTCFullYear() === anio &&
      fechaUTC.getUTCMonth() + 1 === mes &&
      fechaUTC.getUTCDate() === dia
    );
  }

  // Calcular la hora de fin de una cita de 30 minutos
  calcularHoraFin(horaInicio: string): string {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const total = horas * 60 + minutos + 30;

    const hora = String(Math.floor(total / 60)).padStart(2, '0');
    const minuto = String(total % 60).padStart(2, '0');

    return `${hora}:${minuto}`;
  }

  // Comprobar si la cita está dentro de la jornada médica
  estaDentroHorario(medicoId: number, fecha: string, horaInicio: string, horaFin: string): boolean {
    if (!this.fechaValida(fecha)) {
      return false;
    }

    const diaSemana = this.obtenerDiaSemana(fecha);

    return this.horariosService
      .obtenerPorMedico(medicoId)
      .some(
        (horario) =>
          horario.diaSemana === diaSemana &&
          horaInicio >= horario.horaInicio &&
          horaFin <= horario.horaFin,
      );
  }

  // Verificar que el paciente no tenga otra cita simultánea
  pacienteTieneConflicto(
    pacienteId: number,
    fecha: string,
    horaInicio: string,
    horaFin: string,
  ): boolean {
    return this.citasSignal().some(
      (cita) =>
        cita.pacienteId === pacienteId &&
        cita.fecha === fecha &&
        !['Cancelada', 'No asistió'].includes(cita.estado) &&
        horaInicio < cita.horaFin &&
        horaFin > cita.horaInicio,
    );
  }
}
