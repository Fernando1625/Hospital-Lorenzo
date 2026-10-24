import { Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { UsuariosService } from '../../../core/services/usuarios';
import { SesionService } from '../../../core/services/sesion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private sesionService = inject(SesionService);

  // Control visual de contraseña
  mostrarContrasena = signal(false);

  // Mensaje para errores del formulario
  mensajeError = '';

  // Únicamente para pruebas académicas del frontend
  private readonly claveDemo = 'demo1234';

  // Formulario reactivo
  formulario = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],

    contrasena: ['', [Validators.required]],
  });

  // Mostrar u ocultar contraseña
  alternarContrasena(): void {
    this.mostrarContrasena.update((valor) => !valor);
  }

  // Simular el ingreso al sistema
  iniciarSesion(): void {
    this.mensajeError = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

      this.mensajeError = 'Ingrese su nombre de usuario y contraseña.';

      return;
    }

    const datos = this.formulario.getRawValue();

    const nombre = datos.nombreUsuario.trim().toLowerCase();

    // Buscar entre los usuarios ficticios
    const usuario = this.usuariosService
      .usuarios()
      .find((u) => u.nombreUsuario.toLowerCase() === nombre);

    if (!usuario || !usuario.estado || datos.contrasena !== this.claveDemo) {
      this.mensajeError = 'Credenciales de demostración incorrectas o usuario inactivo.';

      return;
    }

    // Guardar el usuario de demostración seleccionado
    this.sesionService.iniciarSesion(usuario);

    // Navegar al panel principal
    this.router.navigate(['/dashboard']);
  }
}
