
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

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
  private route = inject(ActivatedRoute);
  private pacientesService = inject(PacientesService);

  mensajeError = '';
  modoEdicion = false;
  pacienteNoEncontrado = false;
  pacienteId: number | null = null;
  estadoActual = true;

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

  constructor() {
    const idParametro = this.route.snapshot.paramMap.get('id');

    if (idParametro !== null) {
      this.modoEdicion = true;
      const id = Number(idParametro);

      if (!Number.isInteger(id) || id <= 0) {
        this.pacienteNoEncontrado = true;
        return;
      }

      const paciente = this.pacientesService.obtenerPacientePorId(id);

      if (!paciente) {
        this.pacienteNoEncontrado = true;
        return;
      }

      this.pacienteId = paciente.id;
      this.estadoActual = paciente.estado;

      // Cargar los datos existentes en el formulario
      this.formulario.patchValue({
        cedula: paciente.cedula,
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        fechaNacimiento: paciente.fechaNacimiento,
        telefono: paciente.telefono,
        correo: paciente.correo,
        direccion: paciente.direccion
      });
    }
  }

  guardarPaciente(): void {

    this.mensajeError = '';

    if (this.pacienteNoEncontrado) {
      return;
    }

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

    const pacienteDatos = {
      cedula: datos.cedula.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      fechaNacimiento: datos.fechaNacimiento,
      telefono: datos.telefono.trim(),
      correo: datos.correo.trim(),
      direccion: datos.direccion.trim(),
      estado: this.estadoActual
    };

    if (this.modoEdicion && this.pacienteId !== null) {

      const actualizado = this.pacientesService.actualizarPaciente(
        this.pacienteId,
        pacienteDatos
      );

      if (!actualizado) {
        this.mensajeError =
          'No se pudo actualizar el paciente. Verifique la cédula.';
        return;
      }

    } else {

      const registrado = this.pacientesService.registrarPaciente(
        pacienteDatos
      );

      if (!registrado) {
        this.mensajeError =
          'Ya existe un paciente con esta cédula.';
        return;
      }
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
