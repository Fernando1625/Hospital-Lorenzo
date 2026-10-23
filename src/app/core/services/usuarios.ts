
import { Injectable, signal } from '@angular/core';

import {
  Usuario,
  RolUsuario
} from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // Registros ficticios para las pruebas del frontend
  private usuariosSignal = signal<Usuario[]>([
    {
      id: 1,
      nombres: 'Carlos',
      apellidos: 'Ramírez López',
      nombreUsuario: 'admin',
      correo: 'admin@hospital.example',
      rol: 'Administrador',
      estado: true
    },
    {
      id: 2,
      nombres: 'María',
      apellidos: 'Fernández Torres',
      nombreUsuario: 'medico01',
      correo: 'medico@hospital.example',
      rol: 'Médico',
      estado: true
    },
    {
      id: 3,
      nombres: 'Ana',
      apellidos: 'Gómez Pérez',
      nombreUsuario: 'recepcion01',
      correo: 'recepcion@hospital.example',
      rol: 'Recepción',
      estado: true
    },
    {
      id: 4,
      nombres: 'Luis',
      apellidos: 'Mendoza Ruiz',
      nombreUsuario: 'facturacion01',
      correo: 'facturacion@hospital.example',
      rol: 'Facturación',
      estado: false
    }
  ]);

  // Lectura reactiva de los usuarios
  usuarios = this.usuariosSignal.asReadonly();

  // Buscar un usuario por identificador
  obtenerUsuarioPorId(id: number): Usuario | undefined {
    return this.usuariosSignal().find(
      usuario => usuario.id === id
    );
  }

  // Verificar nombres de usuario duplicados
  existeNombreUsuario(
    nombreUsuario: string,
    idExcluir?: number
  ): boolean {

    const nombre = nombreUsuario.trim().toLowerCase();

    return this.usuariosSignal().some(usuario =>
      usuario.nombreUsuario.toLowerCase() === nombre &&
      usuario.id !== idExcluir
    );
  }

  // Comprobar correos duplicados
  existeCorreo(
    correo: string,
    idExcluir?: number
  ): boolean {

    const correoNormalizado = correo.trim().toLowerCase();

    return this.usuariosSignal().some(usuario =>
      usuario.correo.toLowerCase() === correoNormalizado &&
      usuario.id !== idExcluir
    );
  }

  // Contar usuarios de un rol determinado
  contarPorRol(rol: RolUsuario): number {
    return this.usuariosSignal().filter(
      usuario => usuario.rol === rol
    ).length;
  }
}
