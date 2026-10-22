
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
  private route = inject(ActivatedRoute);
  private medicosService = inject(MedicosService);

  mensajeError = '';
  modoEdicion = false;
  medicoNoEncontrado = false;
  medicoId: number | null = null;
  estadoActual = true;

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

  constructor() {
    const idParametro = this.route.snapshot.paramMap.get('id');

    if (idParametro !== null) {
      this.modoEdicion = true;

      const id = Number(idParametro);

      if (!Number.isInteger(id) || id <= 0) {
        this.medicoNoEncontrado = true;
        return;
      }

      const medico = this.medicosService.obtenerMedicoPorId(id);

      if (!medico) {
        this.medicoNoEncontrado = true;
        return;
      }

      this.medicoId = medico.id;
      this.estadoActual = medico.estado;

      // Cargar los datos existentes
      this.formulario.patchValue({
        cedula: medico.cedula,
        nombres: medico.nombres,
        apellidos: medico.apellidos,
        telefono: medico.telefono,
        correo: medico.correo
      });

      // Cargar las especialidades seleccionadas
      this.especialidadesSeleccionadas = [
        ...medico.especialidades
      ];
    }
  }

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

  guardarMedico(): void {

    this.mensajeError = '';

    if (this.medicoNoEncontrado) {
      return;
    }

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

    const medicoDatos = {
      cedula: datos.cedula.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      telefono: datos.telefono.trim(),
      correo: datos.correo.trim(),
      especialidades: [...this.especialidadesSeleccionadas],
      estado: this.estadoActual
    };

    if (this.modoEdicion && this.medicoId !== null) {

      const actualizado = this.medicosService.actualizarMedico(
        this.medicoId,
        medicoDatos
      );

      if (!actualizado) {
        this.mensajeError =
          'No se pudo actualizar. Verifique que la cédula no esté duplicada.';
        return;
      }

    } else {

      const registrado = this.medicosService.registrarMedico(
        medicoDatos
      );

      if (!registrado) {
        this.mensajeError =
          'Ya existe un médico con esta cédula.';
        return;
      }
    }

    // Volver al listado de médicos
    this.router.navigate(['/medicos']);
  }
}
