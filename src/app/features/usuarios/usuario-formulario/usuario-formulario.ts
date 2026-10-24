
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

import { UsuariosService } from '../../../core/services/usuarios';

import {
  RolUsuario
} from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-formulario.html',
  styleUrl: './usuario-formulario.css'
})
export class UsuarioFormulario {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuariosService = inject(UsuariosService);

  // Control del formulario
  modoEdicion = false;
  usuarioNoEncontrado = false;
  usuarioId: number | null = null;
  mensajeError = '';

  // Roles disponibles
  roles: RolUsuario[] = [
    'Administrador',
    'Médico',
    'Recepción',
    'Facturación'
  ];

  // Formulario reactivo
  formulario = this.fb.nonNullable.group({

    nombres: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(60)
    ]],

    apellidos: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(60)
    ]],

    nombreUsuario: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-Z0-9._-]+$/)
    ]],

    correo: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(120)
    ]],

    rol: ['Recepción' as RolUsuario, [
      Validators.required
    ]],

    estado: [true]

  });

  constructor() {

    // Comprobar si la ruta contiene un identificador
    const idParametro = this.route.snapshot.paramMap.get('id');

    // Si no hay ID, estamos registrando un usuario
    if (idParametro === null) {
      return;
    }

    this.modoEdicion = true;

    const id = Number(idParametro);

    if (!Number.isInteger(id) || id <= 0) {
      this.usuarioNoEncontrado = true;
      return;
    }

    const usuario = this.usuariosService.obtenerUsuarioPorId(id);

    if (!usuario) {
      this.usuarioNoEncontrado = true;
      return;
    }

    // Guardar el ID del usuario
    this.usuarioId = usuario.id;

    // Cargar sus datos en el formulario
    this.formulario.patchValue({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      rol: usuario.rol,
      estado: usuario.estado
    });
  }

  // Guardar nuevo usuario o cambios
  guardarUsuario(): void {

    this.mensajeError = '';

    if (this.usuarioNoEncontrado) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeError =
        'Revise los campos obligatorios del formulario.';
      return;
    }

    const datos = this.formulario.getRawValue();

    // Validar campos que contienen solo espacios
    if (
      !datos.nombres.trim() ||
      !datos.apellidos.trim() ||
      !datos.nombreUsuario.trim() ||
      !datos.correo.trim()
    ) {
      this.mensajeError =
        'Los campos obligatorios no pueden estar vacíos.';
      return;
    }

    if (!this.roles.includes(datos.rol)) {
      this.mensajeError = 'Seleccione un rol válido.';
      return;
    }

    // Verificar nombre de usuario duplicado
    if (this.usuariosService.existeNombreUsuario(
      datos.nombreUsuario,
      this.usuarioId ?? undefined
    )) {
      this.mensajeError =
        'El nombre de usuario ya se encuentra registrado.';
      return;
    }

    // Verificar correo duplicado
    if (this.usuariosService.existeCorreo(
      datos.correo,
      this.usuarioId ?? undefined
    )) {
      this.mensajeError =
        'El correo electrónico ya se encuentra registrado.';
      return;
    }

    let guardado = false;

    if (this.modoEdicion && this.usuarioId !== null) {

      // Actualizar usuario existente
      guardado = this.usuariosService.actualizarUsuario(
        this.usuarioId,
        datos
      );

    } else if (!this.modoEdicion) {

      // Registrar un nuevo usuario
      guardado = this.usuariosService.registrarUsuario(datos);

    }

    if (!guardado) {
      this.mensajeError =
        'No se pudo guardar el usuario. Verifique los datos.';
      return;
    }

    // Regresar al listado
    this.router.navigate(['/usuarios']);
  }
}
