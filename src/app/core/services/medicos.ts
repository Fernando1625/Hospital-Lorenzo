
import { Injectable, signal } from '@angular/core';
import { Medico } from '../../shared/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  // Datos ficticios para el desarrollo del frontend
  private medicosSignal = signal<Medico[]>([
    {
      id: 1,
      cedula: '0701234567',
      nombres: 'Carlos Andrés',
      apellidos: 'López García',
      telefono: '0991234567',
      correo: 'carlos@example.com',
      especialidades: ['Cardiología'],
      estado: true
    },
    {
      id: 2,
      cedula: '0709876543',
      nombres: 'María Fernanda',
      apellidos: 'Gómez Torres',
      telefono: '0987654321',
      correo: 'maria@example.com',
      especialidades: ['Pediatría'],
      estado: true
    },
    {
      id: 3,
      cedula: '0704567891',
      nombres: 'José Luis',
      apellidos: 'Mendoza Ruiz',
      telefono: '0974561230',
      correo: 'jose@example.com',
      especialidades: ['Medicina general'],
      estado: false
    }
  ]);

  // Lectura de médicos desde los componentes
  medicos = this.medicosSignal.asReadonly();

  // Obtener un médico según su identificador
  obtenerMedicoPorId(id: number): Medico | undefined {
    return this.medicosSignal().find(
      medico => medico.id === id
    );
  }

  // Comprobar si una cédula ya está registrada
  existeCedula(cedula: string): boolean {
    return this.medicosSignal().some(
      medico => medico.cedula === cedula
    );
  }

  // Registrar un nuevo médico
  registrarMedico(datos: Omit<Medico, 'id'>): boolean {

    if (this.existeCedula(datos.cedula)) {
      return false;
    }

    const medicosActuales = this.medicosSignal();

    const nuevoId = Math.max(
      0,
      ...medicosActuales.map(medico => medico.id)
    ) + 1;

    const nuevoMedico: Medico = {
      ...datos,
      id: nuevoId
    };

    this.medicosSignal.update(medicos => [
      ...medicos,
      nuevoMedico
    ]);

    return true;
  }
  
  // Actualizar los datos de un médico existente
  actualizarMedico(
    id: number,
    datos: Omit<Medico, 'id'>
  ): boolean {

    const medicoActual = this.obtenerMedicoPorId(id);

    if (!medicoActual) {
      return false;
    }

    // Verificar que la cédula no pertenezca a otro médico
    const cedulaDuplicada = this.medicosSignal().some(
      medico =>
        medico.cedula === datos.cedula &&
        medico.id !== id
    );

    if (cedulaDuplicada) {
      return false;
    }

    // Actualizar solamente al médico seleccionado
    this.medicosSignal.update(medicos =>
      medicos.map(medico =>
        medico.id === id
          ? { ...datos, id }
          : medico
      )
    );

    return true;
  }

}
