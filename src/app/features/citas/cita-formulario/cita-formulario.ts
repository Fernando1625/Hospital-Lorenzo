import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { MedicosService } from '../../../core/services/medicos';
import { HorariosService } from '../../../core/services/horarios';
import { CitasService } from '../../../core/services/citas';

@Component({
  selector: 'app-cita-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cita-formulario.html',
  styleUrl: './cita-formulario.css',
})
export class CitaFormulario {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);
  private horariosService = inject(HorariosService);
  private citasService = inject(CitasService);

  mensajeError = '';

  pacientes = this.pacientesService.pacientes;
  medicos = this.medicosService.medicos;

  private route = inject(ActivatedRoute);

  modoEdicion = false;
  citaNoEncontrada = false;
  citaId: number | null = null;

  constructor() {
    const idParametro = this.route.snapshot.paramMap.get('id');

    if (idParametro !== null) {
      this.modoEdicion = true;

      const id = Number(idParametro);

      if (!Number.isInteger(id) || id <= 0) {
        this.citaNoEncontrada = true;
        return;
      }

      const cita = this.citasService.obtenerCitaPorId(id);

      if (!cita || !['Programada', 'Confirmada'].includes(cita.estado)) {
        this.citaNoEncontrada = true;
        return;
      }

      this.citaId = cita.id;

      // Cargar datos existentes
      this.formulario.patchValue({
        pacienteId: cita.pacienteId,
        medicoId: cita.medicoId,
        especialidad: cita.especialidad,
        fecha: cita.fecha,
        horaInicio: cita.horaInicio,
        motivo: cita.motivo,
      });
    }
  }

  // Pacientes habilitados
  get pacientesActivos() {
    return this.pacientes().filter((p) => p.estado);
  }

  // Médicos habilitados
  get medicosActivos() {
    return this.medicos().filter((m) => m.estado);
  }

  formulario = this.fb.nonNullable.group({
    pacienteId: [0, [Validators.required, Validators.min(1)]],
    medicoId: [0, [Validators.required, Validators.min(1)]],
    especialidad: ['', Validators.required],
    fecha: ['', Validators.required],
    horaInicio: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.maxLength(300)]],
  });

  // Fecha actual para limitar el calendario
  get fechaMinima(): string {
    const hoy = new Date();

    return (
      `${hoy.getFullYear()}-` +
      `${String(hoy.getMonth() + 1).padStart(2, '0')}-` +
      `${String(hoy.getDate()).padStart(2, '0')}`
    );
  }

  // Obtener el médico seleccionado
  get medicoSeleccionado() {
    const id = this.formulario.controls.medicoId.value;

    return this.medicosActivos.find((m) => m.id === id);
  }

  // Especialidades del médico seleccionado
  get especialidadesDisponibles(): string[] {
    return this.medicoSeleccionado?.especialidades ?? [];
  }

  // Limpiar los datos dependientes del médico
  alCambiarMedico(): void {
    this.formulario.patchValue({
      especialidad: '',
      horaInicio: '',
    });
    this.mensajeError = '';
  }

  // Limpiar la hora cuando cambia la fecha
  alCambiarFecha(): void {
    this.formulario.controls.horaInicio.setValue('');
    this.mensajeError = '';
  }

  // Obtener las horas libres según la jornada del médico
  get horasDisponibles(): string[] {
    const medicoId = this.formulario.controls.medicoId.value;
    const pacienteId = this.formulario.controls.pacienteId.value;
    const fecha = this.formulario.controls.fecha.value;

    if (
      medicoId <= 0 ||
      !this.medicoSeleccionado ||
      pacienteId <= 0 ||
      !this.citasService.fechaValida(fecha) ||
      fecha < this.fechaMinima
    ) {
      return [];
    }

    const diaSemana = this.citasService.obtenerDiaSemana(fecha);

    const jornadas = this.horariosService
      .obtenerPorMedico(medicoId)
      .filter((h) => h.diaSemana === diaSemana);

    const horas = new Set<string>();

    for (const jornada of jornadas) {
      let inicio = this.aMinutos(jornada.horaInicio);
      const fin = this.aMinutos(jornada.horaFin);

      // Generar espacios de 30 minutos
      while (inicio + 30 <= fin) {
        const horaInicio = this.aHora(inicio);
        const horaFin = this.aHora(inicio + 30);

        const conflictoMedico = this.citasService.existeConflicto(
          medicoId,
          fecha,
          horaInicio,
          horaFin,
          this.citaId ?? undefined,
        );

        const conflictoPaciente = this.citasService.pacienteTieneConflicto(
          pacienteId,
          fecha,
          horaInicio,
          horaFin,
          this.citaId ?? undefined,
        );

        const ahora = new Date();
        const horaActual = this.aHora(ahora.getHours() * 60 + ahora.getMinutes());

        const horarioPasado = fecha === this.fechaMinima && horaInicio <= horaActual;

        if (!conflictoMedico && !conflictoPaciente && !horarioPasado) {
          horas.add(horaInicio);
        }

        inicio += 30;
      }
    }

    return [...horas].sort();
  }

  private aMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  private aHora(minutos: number): string {
    const h = String(Math.floor(minutos / 60)).padStart(2, '0');
    const m = String(minutos % 60).padStart(2, '0');

    return `${h}:${m}`;
  }

  // Registrar cita
  guardarCita(): void {
    this.mensajeError = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    if (!datos.motivo.trim()) {
      this.mensajeError = 'Debe ingresar el motivo de la consulta.';
      return;
    }

    if (!this.horasDisponibles.includes(datos.horaInicio)) {
      this.mensajeError = 'El horario seleccionado ya no está disponible.';
      return;
    }

    const horaFin = this.citasService.calcularHoraFin(datos.horaInicio);

    const registrado = this.citasService.registrarCita({
      pacienteId: datos.pacienteId,
      medicoId: datos.medicoId,
      especialidad: datos.especialidad,
      fecha: datos.fecha,
      horaInicio: datos.horaInicio,
      horaFin: horaFin,
      motivo: datos.motivo.trim(),
      estado: 'Programada',
    });
  //preguntar si esta bien implementado
    const citaDatos = {
      pacienteId: datos.pacienteId,
      medicoId: datos.medicoId,
      especialidad: datos.especialidad,
      fecha: datos.fecha,
      horaInicio: datos.horaInicio,
      horaFin,
      motivo: datos.motivo.trim(),
    };

    let guardado = false;

    if (this.modoEdicion && this.citaId !== null) {
      guardado = this.citasService.reprogramarCita(this.citaId, citaDatos);
    } else if (!this.modoEdicion) {
      guardado = this.citasService.registrarCita({
        ...citaDatos,
        estado: 'Programada',
      });
    }

    if (!guardado) {
      this.mensajeError =
        'No se pudo guardar la cita. Verifique los datos y el horario disponible.';
      return;
    }

    if (!registrado) {
      this.mensajeError = 'No se pudo registrar la cita. Verifique los datos y la disponibilidad.';
      return;
    }

    this.router.navigate(['/citas']);
  }
}
