
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SesionService } from '../../core/services/sesion';
import { RolUsuario } from '../../shared/models/usuario.model';

// Estructura de una opción del menú lateral
interface OpcionMenu {
  titulo: string;
  ruta: string;
  icono: string;
  roles: RolUsuario[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  private sesionService = inject(SesionService);

  // Usuario seleccionado durante la demostración
  usuarioActual = this.sesionService.usuarioActual;

  // Roles que pueden acceder visualmente a cada opción
  private opciones: OpcionMenu[] = [
    {
      titulo: 'Panel principal',
      ruta: '/dashboard',
      icono: '▦',
      roles: [
        'Administrador', 'Médico',
        'Recepción', 'Facturación'
      ]
    },
    {
      titulo: 'Pacientes',
      ruta: '/pacientes',
      icono: '♙',
      roles: [
        'Administrador', 'Médico', 'Recepción'
      ]
    },
    {
      titulo: 'Médicos',
      ruta: '/medicos',
      icono: '✚',
      roles: [
        'Administrador', 'Recepción'
      ]
    },
    {
      titulo: 'Citas médicas',
      ruta: '/citas',
      icono: '▤',
      roles: [
        'Administrador', 'Médico', 'Recepción'
      ]
    },
    {
      titulo: 'Historial clínico',
      ruta: '/historial',
      icono: '▧',
      roles: [
        'Administrador', 'Médico'
      ]
    },
    {
      titulo: 'Gestión de usuarios',
      ruta: '/usuarios',
      icono: '⚙',
      roles: [
        'Administrador'
      ]
    },
    {
      titulo: 'Facturación',
      ruta: '/facturacion',
      icono: '▣',
      roles: [
        'Administrador', 'Facturación'
      ]
    }
  ];

  // Filtrar el menú según el rol actual
  opcionesVisibles = computed(() => {

    const usuario = this.usuarioActual();

    // No mostrar módulos si no existe sesión de demostración
    if (!usuario || !usuario.estado) {
      return [];
    }

    return this.opciones.filter(opcion =>
      opcion.roles.includes(usuario.rol)
    );
  });
}
