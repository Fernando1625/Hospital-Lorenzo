
import { Injectable, signal } from '@angular/core';
import { Paciente } from '../../shared/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private pacientesSignal = signal<Paciente[]>([
    {
      id: 1,
      cedula: '0701234567',
      nombres: 'Ana María',
      apellidos: 'Pérez López',
      fechaNacimiento: '1999-05-12',
      telefono: '0991234567',
      correo: 'ana@example.com',
      direccion: 'Machala',
      estado: true
    },
    {
      id: 2,
      cedula: '0709876543',
      nombres: 'Luis Alberto',
      apellidos: 'Torres Mendoza',
      fechaNacimiento: '1988-08-20',
      telefono: '0987654321',
      correo: 'luis@example.com',
      direccion: 'El Guabo',
      estado: true
    }
  ]);

  // Lista de solo lectura para los componentes
  pacientes = this.pacientesSignal.asReadonly();

  // Comprobar que no exista la misma cédula
  existeCedula(cedula: string): boolean {
    return this.pacientesSignal().some(
      paciente => paciente.cedula === cedula
    );
  }

  // Registrar un nuevo paciente
  registrarPaciente(
    datos: Omit<Paciente, 'id'>
  ): boolean {

    if (this.existeCedula(datos.cedula)) {
      return false;
    }

    const pacientesActuales = this.pacientesSignal();

    const nuevoId = Math.max(
      0,
      ...pacientesActuales.map(p => p.id)
    ) + 1;

    const nuevoPaciente: Paciente = {
      ...datos,
      id: nuevoId
    };

    this.pacientesSignal.update(pacientes => [
      ...pacientes,
      nuevoPaciente
    ]);

    return true;
  }

  
  // Buscar un paciente por su ID
  obtenerPacientePorId(id: number): Paciente | undefined {
    return this.pacientesSignal().find(
      paciente => paciente.id === id
    );
  }

  // Actualizar los datos de un paciente
  actualizarPaciente(
    id: number,
    datos: Omit<Paciente, 'id'>
  ): boolean {

    const pacienteActual = this.obtenerPacientePorId(id);

    if (!pacienteActual) {
      return false;
    }

    // Evitar que otra persona tenga la misma cédula
    const cedulaDuplicada = this.pacientesSignal().some(
      paciente =>
        paciente.cedula === datos.cedula &&
        paciente.id !== id
    );

    if (cedulaDuplicada) {
      return false;
    }

    this.pacientesSignal.update(pacientes =>
      pacientes.map(paciente =>
        paciente.id === id
          ? { ...datos, id }
          : paciente
      )
    );

    return true;
  }
  
  // Activar o desactivar un paciente
  cambiarEstadoPaciente(id: number): boolean {

    const paciente = this.obtenerPacientePorId(id);

    if (!paciente) {
      return false;
    }

    this.pacientesSignal.update(pacientes =>
      pacientes.map(p =>
        p.id === id
          ? { ...p, estado: !p.estado }
          : p
      )
    );

    return true;
  }

}
