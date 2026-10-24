
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SesionService } from '../../core/services/sesion';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  private router = inject(Router);
  private sesionService = inject(SesionService);

  // Usuario que inició sesión en el prototipo
  usuarioActual = this.sesionService.usuarioActual;

  // Cerrar la sesión temporal
  cerrarSesion(): void {

    this.sesionService.cerrarSesion();

    this.router.navigate(['/login']);
  }
}
