
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MedicosService } from '../../../core/services/medicos';

@Component({
  selector: 'app-medico-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './medico-formulario.html',
  styleUrl: './medico-formulario.css'
})
export class MedicoFormulario {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private medicosService = inject(MedicosService);

  mensajeError = '';

  // Catálogo temporal de especialidades
  especialidadesDisponibles: string[] = [
    'Medicina general',
    'Cardiología',
    'Pediatría',
    'Ginecología',
    'Traumatología',
    'Medicina interna',
    'Dermatología',
    'Neurología'
  ];

  especialidadesSeleccionadas: string[] = [];

  // Formulario reactivo
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
    telefono: ['', [
      Validators.pattern(/^(09\d{8})?$/)
    ]],
    correo: ['', [
      Validators.email
    ]]
  });

  // Seleccionar o quitar especialidades
  cambiarEspecialidad(
    especialidad: string,
    seleccionado: boolean
  ): void {

    if (seleccionado) {
      if (!this.especialidadesSeleccionadas.includes(especialidad)) {
        this.especialidadesSeleccionadas.push(especialidad);
      }
    } else {
      this.especialidadesSeleccionadas =
        this.especialidadesSeleccionadas.filter(
          e => e !== especialidad
        );
    }
  }

  // Guardar el nuevo médico
  guardarMedico(): void {

    this.mensajeError = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (this.especialidadesSeleccionadas.length === 0) {
      this.mensajeError =
        'Debe seleccionar al menos una especialidad médica.';
      return;
    }

    const datos = this.formulario.getRawValue();

    if (!datos.nombres.trim() || !datos.apellidos.trim()) {
      this.mensajeError =
        'Los nombres y apellidos no pueden estar vacíos.';
      return;
    }

    const registrado = this.medicosService.registrarMedico({
      cedula: datos.cedula.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      telefono: datos.telefono.trim(),
      correo: datos.correo.trim(),
      especialidades: [...this.especialidadesSeleccionadas],
      estado: true
    });

    if (!registrado) {
      this.mensajeError =
        'Ya existe un médico registrado con esta cédula.';
      return;
    }

    // Regresar al listado
    this.router.navigate(['/medicos']);
  }
}
  