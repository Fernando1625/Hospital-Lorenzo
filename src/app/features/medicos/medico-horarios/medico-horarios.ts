import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MedicosService } from '../../../core/services/medicos';
import { HorariosService } from '../../../core/services/horarios';

@Component({
  selector: 'app-medico-horarios',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './medico-horarios.html',
  styleUrl: './medico-horarios.css',
})
export class MedicoHorarios {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private medicosService = inject(MedicosService);
  private horariosService = inject(HorariosService);

  medicoId = Number(this.route.snapshot.paramMap.get('id'));

  medico = this.medicosService.obtenerMedicoPorId(this.medicoId);

  mensajeError = '';
  mensajeExito = '';

  dias = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' },
  ];

  horarios = computed(() =>
    this.horariosService
      .horarios()
      .filter((h) => h.medicoId === this.medicoId)
      .sort((a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio)),
  );

  formulario = this.fb.nonNullable.group({
    diaSemana: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
    horaInicio: ['08:00', Validators.required],
    horaFin: ['12:00', Validators.required],
  });

  nombreDia(numero: number): string {
    return this.dias.find((d) => d.id === numero)?.nombre ?? '';
  }

  guardarHorario(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.medico || !this.medico.estado) {
      this.mensajeError = 'El médico no existe o está inactivo.';
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    if (datos.horaInicio >= datos.horaFin) {
      this.mensajeError = 'La hora de finalización debe ser posterior a la de inicio.';
      return;
    }

    const registrado = this.horariosService.registrarHorario({
      medicoId: this.medicoId,
      diaSemana: Number(datos.diaSemana),
      horaInicio: datos.horaInicio,
      horaFin: datos.horaFin,
    });

    if (!registrado) {
      this.mensajeError = 'El horario es inválido o se superpone con otro registrado.';
      return;
    }

    this.mensajeExito = 'Horario registrado correctamente.';
  }

  eliminarHorario(id: number): void {
    this.horariosService.eliminarHorario(id);
    this.mensajeError = '';
    this.mensajeExito = 'Horario eliminado correctamente.';
  }
}
