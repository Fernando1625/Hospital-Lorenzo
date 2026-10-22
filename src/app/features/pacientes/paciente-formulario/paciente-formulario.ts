
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';

@Component({
  selector: 'app-paciente-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './paciente-formulario.html',
  styleUrl: './paciente-formulario.css'
})
export class PacienteFormulario {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private pacientesService = inject(PacientesService);

  mensajeError = '';

  formulario = this.fb.nonNullable.group({
    cedula: ['', [
      Validators.required,
      Validators.pattern(/^\d{10}$/)
    ]],
    nombres: ['', [
      Validators.required,
      Validators.maxLength(60)
    ]],
    apellidos: ['', [
      Validators.required,
      Validators.maxLength(60)
    ]],
    fechaNacimiento: ['', Validators.required],
    telefono: ['', Validators.pattern(/^(09\d{8})?$/)],
    correo: ['', Validators.email],
    direccion: ['']
  });

  guardarPaciente(): void {

    this.mensajeError = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    if (datos.fechaNacimiento > this.fechaActual()) {
      this.mensajeError =
        'La fecha de nacimiento no puede ser futura.';
      return;
    }

    const registrado = this.pacientesService.registrarPaciente({
      ...datos,
      cedula: datos.cedula.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      telefono: datos.telefono.trim(),
      correo: datos.correo.trim(),
      direccion: datos.direccion.trim(),
      estado: true
    });

    if (!registrado) {
      this.mensajeError =
        'Ya existe un paciente con esta cédula.';
      return;
    }

    this.router.navigate(['/pacientes']);
  }

  private fechaActual(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}
