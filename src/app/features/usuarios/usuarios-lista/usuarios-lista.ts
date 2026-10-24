import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UsuariosService } from '../../../core/services/usuarios';

import { Usuario, RolUsuario } from '../../../shared/models/usuario.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.css',
})
export class UsuariosLista {
  private usuariosService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);

  // Datos reactivos del servicio
  usuarios = this.usuariosService.usuarios;

  // Variables de los filtros
  busqueda = '';
  filtroRol = 'todos';
  filtroEstado = 'todos';

  roles: RolUsuario[] = ['Administrador', 'Médico', 'Recepción', 'Facturación'];

  // Filtrar usuarios
  get usuariosFiltrados(): Usuario[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.usuarios().filter((usuario) => {
      const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();

      const coincideBusqueda =
        nombreCompleto.includes(texto) ||
        usuario.nombreUsuario.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto);

      const coincideRol = this.filtroRol === 'todos' || usuario.rol === this.filtroRol;

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && usuario.estado) ||
        (this.filtroEstado === 'inactivos' && !usuario.estado);

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }

  // Indicadores
  get totalUsuarios(): number {
    return this.usuarios().length;
  }

  get usuariosActivos(): number {
    return this.usuarios().filter((usuario) => usuario.estado).length;
  }

  get usuariosInactivos(): number {
    return this.usuarios().filter((usuario) => !usuario.estado).length;
  }

  // Usuario seleccionado para activar o desactivar
  usuarioSeleccionado: Usuario | null = null;

  // Mensaje después de realizar una operación
  mensajeOperacion = '';
  errorOperacion = '';

  // Abrir el cuadro de confirmación
  solicitarCambioEstado(usuario: Usuario): void {
    this.mensajeOperacion = '';
    this.errorOperacion = '';

    // Comprobar si es el último administrador activo
    if (usuario.estado && this.usuariosService.esUltimoAdministradorActivo(usuario.id)) {
      this.errorOperacion = 'No es posible desactivar al último administrador activo.';
      return;
    }

    this.usuarioSeleccionado = usuario;
  }

  // Confirmar el cambio de estado

  confirmarCambioEstado(): void {
    if (!this.usuarioSeleccionado) {
      return;
    }

    const usuario = this.usuarioSeleccionado;

    // Guardar el estado anterior
    const estabaActivo = usuario.estado;

    // Cambiar el estado desde el servicio
    const resultado = this.usuariosService.cambiarEstadoUsuario(usuario.id);

    if (resultado) {
      this.mensajeOperacion =
        `El usuario ${usuario.nombreUsuario} fue ` +
        `${estabaActivo ? 'desactivado' : 'activado'} correctamente.`;
    } else {
      this.errorOperacion = 'No fue posible cambiar el estado del usuario.';
    }

    // Cerrar cuadro de confirmación
    this.usuarioSeleccionado = null;

    // Solicitar actualización de la vista
    this.cdr.detectChanges();
  }

  // Cerrar el cuadro sin modificar los datos
  cancelarCambioEstado(): void {
    this.usuarioSeleccionado = null;
  }
}
