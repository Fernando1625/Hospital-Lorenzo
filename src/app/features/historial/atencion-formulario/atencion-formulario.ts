
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PacientesService } from '../../../core/services/pacientes';
import { MedicosService } from '../../../core/services/medicos';
import { CitasService } from '../../../core/services/citas';
import { HistorialService } from '../../../core/services/historial';

@Component({
  selector: 'app-atencion-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './atencion-formulario.html',
  styleUrl: './atencion-formulario.css'
})
export class AtencionFormulario {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private pacientesService = inject(PacientesService);
  private medicosService = inject(MedicosService);
  private citasService = inject(CitasService);
  private historialService = inject(HistorialService);

  mensajeError = '';

  pacienteId = Number(
    this.route.snapshot.paramMap.get('id')
  );

  paciente = this.pacientesService.obtenerPacientePorId(
    this.pacienteId
  );

  citas = this.citasService.citas;
  atenciones = this.historialService.atenciones;

  // Citas del paciente que actualmente están en atención
  get citasDisponibles() {
    const citasRegistradas = this.atenciones()
      .map(atencion => atencion.citaId)
      .filter(id => id !== null);

    return this.citas().filter(cita =>
      cita.pacienteId === this.pacienteId &&
      cita.estado === 'En atención' &&
      !citasRegistradas.includes(cita.id)
    );
  }

  formulario = this.fb.nonNullable.group({
    citaId: [0, [Validators.required, Validators.min(1)]],
    sintomas: ['', [Validators.required, Validators.maxLength(2000)]],
    diagnostico: ['', [Validators.required, Validators.maxLength(2000)]],
    tratamiento: ['', [Validators.required, Validators.maxLength(2000)]],
    observaciones: ['', Validators.maxLength(2000)],

    temperatura: [''],
    presionArterial: [''],
    frecuenciaCardiaca: [''],
    peso: [''],
    estatura: ['']
  });

  // Obtener la cita seleccionada
  get citaSeleccionada() {
    const id = this.formulario.controls.citaId.value;

    return this.citasDisponibles.find(cita => cita.id === id);
  }

  // Obtener el médico responsable de la cita
  get medicoSeleccionado() {
    const medicoId = this.citaSeleccionada?.medicoId;

    return medicoId !== undefined
      ? this.medicosService.obtenerMedicoPorId(medicoId)
      : undefined;
  }

  // Fecha actual en formato YYYY-MM-DD
  get fechaActual(): string {
    const hoy = new Date();

    return (
      `${hoy.getFullYear()}-` +
      `${String(hoy.getMonth() + 1).padStart(2, '0')}-` +
      `${String(hoy.getDate()).padStart(2, '0')}`
    );
  }

  // Convertir un campo opcional a número o null
  private numeroOpcional(valor: string): number | null {
    return valor.trim() === '' ? null : Number(valor);
  }

  guardarAtencion(): void {
    this.mensajeError = '';

    if (!this.paciente || !this.paciente.estado) {
      this.mensajeError =
        'El paciente no existe o está inactivo.';
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeError =
        'Complete correctamente los campos obligatorios.';
      return;
    }

    const datos = this.formulario.getRawValue();
    const cita = this.citaSeleccionada;

    if (!cita || !this.medicoSeleccionado) {
      this.mensajeError =
        'Debe seleccionar una cita médica válida.';
      return;
    }

    if (
      !datos.sintomas.trim() ||
      !datos.diagnostico.trim() ||
      !datos.tratamiento.trim()
    ) {
      this.mensajeError =
        'Los síntomas, diagnóstico y tratamiento son obligatorios.';
      return;
    }

    // Validar las mediciones numéricas opcionales
    const camposNumericos = [
      datos.temperatura,
      datos.frecuenciaCardiaca,
      datos.peso,
      datos.estatura
    ];

    if (camposNumericos.some(valor =>
      valor.trim() !== '' &&
      (!Number.isFinite(Number(valor)) || Number(valor) <= 0)
    )) {
      this.mensajeError =
        'Las mediciones deben ser números positivos.';
      return;
    }

    const temperatura = this.numeroOpcional(datos.temperatura);
    const frecuenciaCardiaca =
      this.numeroOpcional(datos.frecuenciaCardiaca);
    const peso = this.numeroOpcional(datos.peso);
    const estatura = this.numeroOpcional(datos.estatura);

    const presionArterial =
      datos.presionArterial.trim() || null;

    const registrado = this.historialService.registrarAtencion({
      pacienteId: this.pacienteId,
      medicoId: cita.medicoId,
      citaId: cita.id,
      fechaAtencion: this.fechaActual,

      sintomas: datos.sintomas,
      diagnostico: datos.diagnostico,
      tratamiento: datos.tratamiento,
      observaciones: datos.observaciones,

      temperatura,
      presionArterial,
      frecuenciaCardiaca,
      peso,
      estatura
    });

    if (!registrado) {
      this.mensajeError =
        'No se pudo registrar la atención. Revise los datos ingresados.';
      return;
    }

    this.router.navigate(['/historial', this.pacienteId]);
  }
}
