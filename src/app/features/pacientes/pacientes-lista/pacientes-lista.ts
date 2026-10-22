
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PacienteListado {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  estado: boolean;
}

@Component({
  selector: 'app-pacientes-lista',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pacientes-lista.html',
  styleUrl: './pacientes-lista.css'
})
export class PacientesLista {

  // Texto ingresado en la búsqueda
  busqueda: string = '';

  // Pacientes ficticios para probar el frontend
  pacientes: PacienteListado[] = [
    {
      id: 1,
      cedula: '0701234567',
      nombres: 'Ana María',
      apellidos: 'Pérez López',
      telefono: '0991234567',
      correo: 'ana@example.com',
      estado: true
    },
    {
      id: 2,
      cedula: '0709876543',
      nombres: 'Luis Alberto',
      apellidos: 'Torres Mendoza',
      telefono: '0987654321',
      correo: 'luis@example.com',
      estado: true
    },
    {
      id: 3,
      cedula: '0704567891',
      nombres: 'María Fernanda',
      apellidos: 'Gómez Ruiz',
      telefono: '0974561230',
      correo: 'maria@example.com',
      estado: false
    }
  ];

  // Obtener pacientes que coincidan con la búsqueda
  get pacientesFiltrados(): PacienteListado[] {

    const texto = this.busqueda.toLowerCase().trim();

    return this.pacientes.filter(paciente =>
      paciente.cedula.includes(texto) ||
      paciente.nombres.toLowerCase().includes(texto) ||
      paciente.apellidos.toLowerCase().includes(texto)
    );
  }
}
