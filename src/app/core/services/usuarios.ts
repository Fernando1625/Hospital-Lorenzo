
import { Injectable, signal } from '@angular/core';

import {
  Usuario,
  RolUsuario
} from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // Datos ficticios del sistema
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

  // Lista de usuarios de solo lectura
  usuarios = this.usuariosSignal.asReadonly();

  // Buscar usuario por ID
  obtenerUsuarioPorId(id: number): Usuario | undefined {
    return this.usuariosSignal().find(
      usuario => usuario.id === id
    );
  }

  // Validar nombre de usuario duplicado
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

  // Validar correo duplicado
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

  // Contar usuarios por rol
  contarPorRol(rol: RolUsuario): number {
    return this.usuariosSignal().filter(
      usuario => usuario.rol === rol
    ).length;
  }

  // REGISTRAR UN NUEVO USUARIO
  registrarUsuario(datos: Omit<Usuario, 'id'>): boolean {

    if (
      this.existeNombreUsuario(datos.nombreUsuario) ||
      this.existeCorreo(datos.correo)
    ) {
      return false;
    }

    const usuariosActuales = this.usuariosSignal();

    const nuevoId = Math.max(
      0,
      ...usuariosActuales.map(usuario => usuario.id)
    ) + 1;

    this.usuariosSignal.update(usuarios => [
      ...usuarios,
      {
        ...datos,
        nombres: datos.nombres.trim(),
        apellidos: datos.apellidos.trim(),
        nombreUsuario: datos.nombreUsuario.trim(),
        correo: datos.correo.trim().toLowerCase(),
        id: nuevoId
      }
    ]);

    return true;
  }

  // ACTUALIZAR UN USUARIO EXISTENTE
  actualizarUsuario(
    id: number,
    datos: Omit<Usuario, 'id'>
  ): boolean {

    const usuarioActual = this.obtenerUsuarioPorId(id);

    if (!usuarioActual) {
      return false;
    }

    // Evitar duplicados, excluyendo al usuario editado
    if (
      this.existeNombreUsuario(datos.nombreUsuario, id) ||
      this.existeCorreo(datos.correo, id)
    ) {
      return false;
    }

    this.usuariosSignal.update(usuarios =>
      usuarios.map(usuario =>
        usuario.id === id
          ? {
              ...datos,
              nombres: datos.nombres.trim(),
              apellidos: datos.apellidos.trim(),
              nombreUsuario: datos.nombreUsuario.trim(),
              correo: datos.correo.trim().toLowerCase(),
              id
            }
          : usuario
      )
    );

    return true;
  }
}
