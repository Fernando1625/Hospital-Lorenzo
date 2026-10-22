
import { Injectable, signal } from '@angular/core';
import { Cita } from '../../shared/models/cita.model';

@Injectable({
  providedIn: 'root'
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
      estado: 'Confirmada'
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
      estado: 'Programada'
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
      estado: 'Cancelada'
    }
  ]);

  // Consulta reactiva de las citas
  citas = this.citasSignal.asReadonly();

  // Buscar cita por identificador
  obtenerCitaPorId(id: number): Cita | undefined {
    return this.citasSignal().find(
      cita => cita.id === id
    );
  }

  // Comprobar conflictos de horario
  existeConflicto(
    medicoId: number,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    citaExcluirId?: number
  ): boolean {

    return this.citasSignal().some(cita =>
      cita.medicoId === medicoId &&
      cita.fecha === fecha &&
      cita.id !== citaExcluirId &&
      !['Cancelada', 'No asistió'].includes(cita.estado) &&
      horaInicio < cita.horaFin &&
      horaFin > cita.horaInicio
    );
  }

  // Registrar una nueva cita
  registrarCita(datos: Omit<Cita, 'id'>): boolean {

    if (
      !datos.fecha ||
      datos.horaInicio >= datos.horaFin ||
      this.existeConflicto(
        datos.medicoId,
        datos.fecha,
        datos.horaInicio,
        datos.horaFin
      )
    ) {
      return false;
    }

    const citasActuales = this.citasSignal();

    const nuevoId = Math.max(
      0,
      ...citasActuales.map(cita => cita.id)
    ) + 1;

    this.citasSignal.update(citas => [
      ...citas,
      {
        ...datos,
        id: nuevoId
      }
    ]);

    return true;
  }
}
