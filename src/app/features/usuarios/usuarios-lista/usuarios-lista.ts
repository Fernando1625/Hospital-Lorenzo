
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../../core/services/usuarios';

import {
  Usuario,
  RolUsuario
} from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.css'
})
export class UsuariosLista {

  private usuariosService = inject(UsuariosService);

  // Datos reactivos del servicio
  usuarios = this.usuariosService.usuarios;

  // Variables de los filtros
  busqueda = '';
  filtroRol = 'todos';
  filtroEstado = 'todos';

  roles: RolUsuario[] = [
    'Administrador',
    'Médico',
    'Recepción',
    'Facturación'
  ];

  // Filtrar usuarios
  get usuariosFiltrados(): Usuario[] {

    const texto = this.busqueda.toLowerCase().trim();

    return this.usuarios().filter(usuario => {

      const nombreCompleto =
        `${usuario.nombres} ${usuario.apellidos}`
          .toLowerCase();

      const coincideBusqueda =
        nombreCompleto.includes(texto) ||
        usuario.nombreUsuario.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto);

      const coincideRol =
        this.filtroRol === 'todos' ||
        usuario.rol === this.filtroRol;

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && usuario.estado) ||
        (this.filtroEstado === 'inactivos' && !usuario.estado);

      return coincideBusqueda &&
             coincideRol &&
             coincideEstado;
    });
  }

  // Indicadores
  get totalUsuarios(): number {
    return this.usuarios().length;
  }

  get usuariosActivos(): number {
    return this.usuarios().filter(
      usuario => usuario.estado
    ).length;
  }

  get usuariosInactivos(): number {
    return this.usuarios().filter(
      usuario => !usuario.estado
    ).length;
  }
}
