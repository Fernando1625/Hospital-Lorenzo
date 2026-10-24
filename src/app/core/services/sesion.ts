
import { Injectable, computed, signal } from '@angular/core';

import { Usuario } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  // Usuario seleccionado durante la demostración
  private usuarioSignal = signal<Usuario | null>(null);

  // Lectura pública de la sesión
  usuarioActual = this.usuarioSignal.asReadonly();

  // Indica si hay un usuario seleccionado
  sesionIniciada = computed(() =>
    this.usuarioSignal() !== null
  );

  // Guardar el usuario que ingresó
  iniciarSesion(usuario: Usuario): void {
    this.usuarioSignal.set({ ...usuario });
  }

  // Limpiar los datos de la sesión temporal
  cerrarSesion(): void {
    this.usuarioSignal.set(null);
  }
}
