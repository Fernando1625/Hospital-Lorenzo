import { Injectable, signal } from '@angular/core';
import { Horario } from '../../shared/models/horario.model';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  private horariosSignal = signal<Horario[]>([
    {
      id: 1,
      medicoId: 1,
      diaSemana: 1,
      horaInicio: '08:00',
      horaFin: '12:00',
    },
    {
      id: 2,
      medicoId: 1,
      diaSemana: 3,
      horaInicio: '14:00',
      horaFin: '18:00',
    },
  ]);

  horarios = this.horariosSignal.asReadonly();

  obtenerPorMedico(medicoId: number): Horario[] {
    return this.horariosSignal().filter((horario) => horario.medicoId === medicoId);
  }

  // Comprobar superposición con horarios existentes
  existeConflicto(
    medicoId: number,
    diaSemana: number,
    horaInicio: string,
    horaFin: string,
  ): boolean {
    return this.horariosSignal().some(
      (horario) =>
        horario.medicoId === medicoId &&
        horario.diaSemana === diaSemana &&
        horaInicio < horario.horaFin &&
        horaFin > horario.horaInicio,
    );
  }

  registrarHorario(datos: Omit<Horario, 'id'>): boolean {
    if (
      !Number.isInteger(datos.diaSemana) ||
      datos.diaSemana < 1 ||
      datos.diaSemana > 7 ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(datos.horaInicio) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(datos.horaFin) ||
      datos.horaInicio >= datos.horaFin
    ) {
      return false;
    }

    if (this.existeConflicto(datos.medicoId, datos.diaSemana, datos.horaInicio, datos.horaFin)) {
      return false;
    }

    const horariosActuales = this.horariosSignal();

    const nuevoId = Math.max(0, ...horariosActuales.map((h) => h.id)) + 1;

    this.horariosSignal.update((horarios) => [...horarios, { ...datos, id: nuevoId }]);

    return true;
  }

  eliminarHorario(id: number): void {
    this.horariosSignal.update((horarios) => horarios.filter((horario) => horario.id !== id));
  }
}
